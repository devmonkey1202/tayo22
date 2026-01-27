// pages/admin/sms.jsx
import { useEffect, useMemo, useState } from "react";
// Admin 레이아웃 (경로: components/AdminLayout.jsx)
// 다른 위치라면 import 경로만 맞춰 주세요.
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminSms() {
  // 🔄 toText 로 변경 (numbers → toText)
  const [toText, setToText] = useState("");

  const [msg, setMsg] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("AUTO"); // AUTO | SMS | LMS
  const [test, setTest] = useState(false);
  const [log, setLog] = useState(null);

  // 📒 저장된 수신자 관련 상태
  const [recipients, setRecipients] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [addPhone, setAddPhone] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [saving, setSaving] = useState(false);

  const bytes = useMemo(() => new TextEncoder().encode(msg || "").length, [msg]);

  // 유틸: 숫자만 남기기
  const onlyDigits = (s) => (s || "").replace(/\D/g, "");
  const isKoreanPhoneLen = (d) => d.length >= 10 && d.length <= 11;

  // 📥 저장된 수신번호 가져오기
  const fetchRecipients = async () => {
    try {
      setLoadingRec(true);
      const r = await fetch("/api/recipients");
      const j = await r.json();
      if (j?.ok) setRecipients(Array.isArray(j.data) ? j.data : []);
      else console.warn(j);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRec(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, []);

  // ➕ 새 번호 저장 (DB)
  const onAddRecipient = async () => {
    const digits = onlyDigits(addPhone);
    if (!isKoreanPhoneLen(digits)) {
      alert("번호를 정확히 입력해주세요. (예: 01012345678)");
      return;
    }
    try {
      setSaving(true);
      const r = await fetch("/api/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits, label: addLabel || undefined }),
      });
      const j = await r.json();
      if (!j?.ok) {
        alert(j?.error || "저장 실패");
        return;
      }
      setAddPhone("");
      setAddLabel("");
      await fetchRecipients();
      alert("저장 완료");
    } catch (e) {
      console.error(e);
      alert("저장 중 오류");
    } finally {
      setSaving(false);
    }
  };

  // ⤴️ 리스트에서 textarea 로 추가
  const appendPhoneToTextarea = (phone) => {
    const digits = onlyDigits(phone);
    if (!digits) return;
    const cur = (toText || "").trim();
    const hasAlready = cur
      .split(/[\s,;\n]+/)
      .map((x) => onlyDigits(x))
      .filter(Boolean)
      .includes(digits);
    if (hasAlready) return;
    setToText(cur ? `${cur}, ${digits}` : digits);
  };

  // 🗑️ 저장된 번호 삭제
  const onDeleteRecipient = async (id) => {
    if (!confirm("이 번호를 삭제할까요?")) return;
    try {
      const r = await fetch(`/api/recipients/${id}`, { method: "DELETE" });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j?.ok !== false) {
        setRecipients((prev) => prev.filter((x) => x.id !== id));
      } else {
        alert(j?.message || "삭제 실패");
      }
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류");
    }
  };

  // ▶ 발송
  const onSend = async () => {
    const body = {
      to: toText,
      msg,
      title: title || undefined,
      msgType: type === "AUTO" ? undefined : type,
      test,
    };
    const r = await fetch("/api/sms/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    setLog(j);
    alert(j?.data?.message || (j.ok ? "요청 완료" : "실패"));
  };

  // ▶ 잔여건수
  const onRemain = async () => {
    const r = await fetch("/api/sms/remain");
    const j = await r.json();
    setLog(j);
    alert(`SMS:${j?.data?.SMS_CNT} / LMS:${j?.data?.LMS_CNT} / MMS:${j?.data?.MMS_CNT}`);
  };

  return (
    <AdminLayout title="">
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-extrabold mb-4">문자 발송 (Aligo)</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* ====== 좌측 2열: 기존 발송 폼 ====== */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="font-semibold">수신번호</label>
              <textarea
                className="mt-1 w-full h-28 rounded border p-2"
                placeholder="여러 명이면 줄바꿈/쉼표로 구분 (예: 01012345678, 01098765432)"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold">메시지</label>
                <textarea
                  className="mt-1 w-full h-40 rounded border p-2"
                  placeholder="발송할 내용"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <div className="text-sm text-slate-600 mt-1">
                  바이트: <b>{bytes}</b>{" "}
                  <span className="ml-2">
                    타입 추정: <b>{bytes > 90 ? "LMS" : "SMS"}</b>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="font-semibold block mb-1">발송 타입</label>
                  <select className="rounded border p-2 w-full" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="AUTO">AUTO (90바이트 기준 자동)</option>
                    <option value="SMS">SMS (짧은문자)</option>
                    <option value="LMS">LMS (장문, 제목 필요)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">제목 (LMS/MMS)</label>
                  <input
                    className="rounded border p-2 w-full"
                    placeholder="알림"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={test} onChange={(e) => setTest(e.target.checked)} />
                  테스트 모드(Y)로 전송
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={onSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-500"
                  >
                    발송
                  </button>
                  <button
                    onClick={onRemain}
                    className="px-4 py-2 bg-slate-100 rounded font-bold hover:bg-slate-200"
                  >
                    잔여건수 확인
                  </button>
                </div>
              </div>
            </div>

            <pre className="bg-slate-50 border rounded p-3 overflow-x-auto text-sm">
{JSON.stringify(log, null, 2)}
            </pre>
          </div>

          {/* ====== 우측 1열: 저장된 수신번호 패널 ====== */}
          <aside className="md:col-span-1 space-y-4">
            <div className="rounded border p-3">
              <div className="font-bold mb-2">번호 저장</div>
              <div className="space-y-2">
                <input
                  className="w-full rounded border p-2"
                  placeholder="예: 01012345678"
                  value={addPhone}
                  onChange={(e) => setAddPhone(e.target.value)}
                />
                <input
                  className="w-full rounded border p-2"
                  placeholder="라벨(옵션) 예: 김영희"
                  value={addLabel}
                  onChange={(e) => setAddLabel(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={onAddRecipient}
                    disabled={saving}
                    className="px-3 py-2 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-500 disabled:opacity-60"
                  >
                    {saving ? "저장 중..." : "추가"}
                  </button>
                  <button
                    onClick={fetchRecipients}
                    className="px-3 py-2 bg-slate-100 rounded font-bold hover:bg-slate-200"
                  >
                    새로고침
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded border p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-bold">저장된 수신번호</div>
                <span className="text-xs text-slate-500">{loadingRec ? "불러오는 중..." : `${recipients.length}건`}</span>
              </div>

              <div className="max-h-[360px] overflow-auto divide-y">
                {recipients.map((r) => (
                  <div key={r.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{r.label || "이름 없음"}</div>
                      <div className="text-sm text-slate-600">{r.phone}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => appendPhoneToTextarea(r.phone)}
                        className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded font-bold hover:bg-blue-100"
                      >
                        추가
                      </button>
                      <button
                        onClick={() => onDeleteRecipient(r.id)}
                        className="px-2.5 py-1.5 border rounded text-slate-700 hover:bg-slate-100"
                        title="저장된 번호 삭제"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}

                {!loadingRec && recipients.length === 0 && (
                  <div className="py-8 text-center text-slate-500 text-sm">저장된 번호가 없습니다.</div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                목록의 <b>추가</b>를 누르면 위 <b>수신번호</b> 입력창에 자동으로 붙습니다.
              </div>
            </div>

            <div className="rounded border p-3 bg-slate-50">
              <div className="text-xs text-slate-600 leading-relaxed">
                * 하이픈(-)은 자동으로 제거되어 저장됩니다. <br />
                * 중복 추가는 자동으로 무시됩니다. <br />
                * 대량 발송 시 쉼표/줄바꿈으로 구분하세요.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </AdminLayout>
  );
}
