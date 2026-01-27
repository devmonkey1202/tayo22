import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminHome({ stats }) {
  return (
    <>
      <Head><title>관리자 홈</title></Head>
      <AdminLayout title="관리자 홈">
        <div className="p-6">
          <div className="mb-4 text-gray-600">문자 발송 현황 및 관리를 확인하세요.</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label:"SMS", value: stats.sms },
              { label:"LMS", value: stats.lms },
              { label:"MMS", value: stats.mms },
            ].map((c)=>(
              <div key={c.label} className="bg-white rounded-2xl border shadow p-6">
                <div className="text-sm text-gray-500">{c.label}</div>
                <div className="text-3xl font-extrabold mt-2">{c.value}건</div>
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx){
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  if (!process.env.ADMIN_TOKEN || cookies.admin_token !== process.env.ADMIN_TOKEN) {
    return { redirect: { destination:"/admin/login", permanent:false } };
  }
  const base = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const r = await fetch(`${base}/api/admin/stats`, { headers: { Cookie: ctx.req.headers.cookie } });
  const stats = r.ok ? await r.json() : { sms:0,lms:0,mms:0 };
  return { props: { stats } };
}
