--
-- PostgreSQL database dump
--

\restrict 3wLGKd1dcAEWZ3EFr1kGR2DcwKk6Uy5fy29sJRpaXLdYUjTDkEPvbGxZnWHiDvt

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$ BEGIN NEW."updatedAt"=NOW(); RETURN NEW; END; $$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Faq; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Faq" (
    id integer NOT NULL,
    icon text NOT NULL,
    q text NOT NULL,
    a text NOT NULL
);


--
-- Name: Faq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Faq_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Faq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Faq_id_seq" OWNED BY public."Faq".id;


--
-- Name: Recipient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Recipient" (
    id integer NOT NULL,
    phone text NOT NULL,
    label text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    name text
);


--
-- Name: Recipient_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Recipient_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Recipient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Recipient_id_seq" OWNED BY public."Recipient".id;


--
-- Name: Reservation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Reservation" (
    id integer NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    gender text,
    "carType" text,
    region text,
    memo text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status text DEFAULT '상담신청중'::text NOT NULL
);


--
-- Name: Reservation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Reservation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Reservation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Reservation_id_seq" OWNED BY public."Reservation".id;


--
-- Name: Review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Review" (
    id integer NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    author text,
    email text,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    views integer DEFAULT 0 NOT NULL
);


--
-- Name: Review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Review_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Review_id_seq" OWNED BY public."Review".id;


--
-- Name: Setting; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Setting" (
    id integer NOT NULL,
    "kakaoUrl" text NOT NULL,
    "metaTitle" text NOT NULL,
    "metaDesc" text NOT NULL
);


--
-- Name: Setting_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Setting_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Setting_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Setting_id_seq" OWNED BY public."Setting".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: Faq id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Faq" ALTER COLUMN id SET DEFAULT nextval('public."Faq_id_seq"'::regclass);


--
-- Name: Recipient id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Recipient" ALTER COLUMN id SET DEFAULT nextval('public."Recipient_id_seq"'::regclass);


--
-- Name: Reservation id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reservation" ALTER COLUMN id SET DEFAULT nextval('public."Reservation_id_seq"'::regclass);


--
-- Name: Review id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review" ALTER COLUMN id SET DEFAULT nextval('public."Review_id_seq"'::regclass);


--
-- Name: Setting id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Setting" ALTER COLUMN id SET DEFAULT nextval('public."Setting_id_seq"'::regclass);


--
-- Data for Name: Faq; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Faq" (id, icon, q, a) FROM stdin;
\.


--
-- Data for Name: Recipient; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Recipient" (id, phone, label, "createdAt", name) FROM stdin;
1	01040585989	테스트	2025-08-29 23:37:20.208	\N
7	01044784773	정실장	2025-09-07 10:02:17.687	\N
8	01033784773	김은화	2025-09-07 10:02:35.911	\N
9	01058902466	박춘미	2025-09-07 10:02:55.159	\N
\.


--
-- Data for Name: Reservation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Reservation" (id, name, phone, gender, "carType", region, memo, "createdAt", status) FROM stdin;
1	신주원	01040585989	남자	희망	서울시	123	2025-08-29 22:59:12.577	상담신청중
2	juwon12o2	01040595959	남자	희망	서울시	sadsagsgsg	2025-08-30 00:59:36.934	상담신청중
3	vvs	01040595959	여자	희망	123	adasfsaaf	2025-08-30 01:52:31.281	상담신청중
4	dasd	01040585989	남자	희망	123	ff	2025-08-30 16:06:37.872	상담신청중
5	ㅊㅁㄴ	01011111111	남자	희망	서울	123	2025-08-30 22:17:27.732	상담신청중
6	ㅇㅇ	01010010001	남자	희망	dd	faf	2025-08-31 01:26:25.618	상담신청중
7	tq	01040585989	남자	희망	tqtq	tqtq	2025-08-31 10:45:43.245	상담신청중
8	진짜	01040000000	남자	희망	진짜 끝이라고??	정말로?>?	2025-08-31 11:07:09.276	상담신청중
11	왜	01011111111	남자	희망	dho	dho	2025-08-31 18:23:43.155	상담신청중
12	정태빈	01099999999	남자	자차	서울시	ERWER	2025-09-02 02:47:14.374	상담신청중
14	zz	01040595959	남자	희망	asd	asd	2025-09-02 04:20:07.137	상담신청중
15	테스트	01012345678	남자	희망	서울시	테스트문의	2025-09-02 12:34:06.517	상담신청중
16	xxx	01012341234	남자	희망	xxxxx	xxxxxxxxxxxxxxxxxxxxxxxxxxxx	2025-09-03 18:04:23.627	상담신청중
38	장재원	01028334339	남자	희망	고양시 덕양구 푸른마을로120번길 34	운전 경력: 초보 / 대형차량운전병으로 만기전역하여 1종대형면허가 있으나, 부대에서 운전할 기회가 없어서 군 복무 기간 중 약 350km를 운행한게 전부입니다.\n전역 후 간간히 연수를 받았지만 꾸준히 할 일이 없어서 감을 전부 잃었습니다.\n첫 직장이 강남 부근이고, 외근 출장이 번번히 있다보니 연수 신청을 하게 됐습니다. 서울 운전에 대한 막연한 두려움을 떨쳐내고 싶습니다.\n감사합니다.	2025-09-18 23:18:20.974	상담확인
17	이윤수	01099999999	남자	희망	대전	제가 이윤수입니다	2025-09-04 08:42:43.936	상담완료됨
19	테스트	01077777777	남자	희망	테스트지역	테스트입니다.	2025-09-07 10:31:06.253	상담신청중
20	test	01011111111	남자	희망	서울시	xxxxx	2025-09-07 10:39:43.291	상담신청중
18	zz	01012345673	남자	희망	asd	asd	2025-09-05 12:57:59.684	상담완료됨
21	타요테스트	010-4047-0000	여자	자차	서울	ㅇ	2025-09-08 08:30:10.419	상담신청중
22	xxx	01077777777	남자	희망	test	ff	2025-09-08 08:56:07.59	상담신청중
23	ttest	01077777777	남자	희망	ttteesstt	dddd	2025-09-08 10:21:02.344	상담신청중
24	test	01011111111	남자	희망	서울시	ㅇㄴㅁㄴ	2025-09-08 11:51:50.949	상담신청중
25	유타요	01077274773	남자	자차	서울	\N	2025-09-09 03:22:38.745	상담확인
26	test	01012341234	남	자차	스울	ㅇㅇ	2025-09-09 18:50:00	상담확인
40	전은정	01056384216	여자	희망	경기도 광주시 	\N	2025-09-20 01:10:51.059	상담확인
39	권은미	01037313118	여자	자차	서울시	여성강사 희망합니다.	2025-09-19 00:38:15.86	상담확인
41	김유민	01035706367	여자	희망	서울시	\N	2025-09-20 03:03:20.964	상담확인
29	김나율	01056027824	여자	자차	하남시	\N	2025-09-15 01:07:53.657	상담확인
28	테스트트	01044444444	여자	자차	광주	\N	2025-09-10 10:06:26.102	상담확인
27	테스트	01088888888	남자	희망	대전광역시	ㅇㅇㅇ	2025-09-09 19:57:11.186	상담확인
30	이준호	01035372229	여자	희망	서울시	\N	2025-09-15 14:56:19.165	상담확인
31	장영형	01027776500	남자	희망	서초구	일정조율필요	2025-09-16 01:35:52.02	상담확인
32	최유성	01073647172	여자	희망	서울	\N	2025-09-16 12:09:23.435	상담확인
33	박준석	010-8448-8138	남자	희망	부천시 중동	3일반 연수로 , 금토일로 받을수 있나요?	2025-09-16 12:48:40.103	상담확인
34	이재은	01056590277	여자	자차	김포시	여성강사분 희망해요	2025-09-17 11:54:09.732	상담확인
35	김예나	01031200772	남자	자차	서울시 동작구	도로연수	2025-09-17 12:18:49.889	상담확인
36	김혜인	01036899079	여자	자차	서울시 서대문구	친절한 강사님 부탁드립니다	2025-09-18 11:15:26.835	상담확인
37	박진아	01033327419	여자	희망	고양시	\N	2025-09-18 12:48:36.065	상담확인
45	권나영	010-8764-5326	여자	자차	부천시 옥길동	- 가격 문의\n-  평일 8시 이후 가능문의\n- 주말 연수 가능 문의	2025-09-22 02:44:47.544	상담확인
42	송현주	01090075456	여자	자차	경기 광주시	\N	2025-09-20 05:06:56.411	상담확인
43	지금순	01091869987	여자	자차	성남시	\N	2025-09-21 02:09:26.202	상담확인
44	박재현	01066826930	여자	희망	고양시	출퇴근 운전 연습이 필요해서 1시간 고양시에서 인천시 가는 연습이 필요합니다.	2025-09-22 01:30:12.384	상담확인
46	박진희	01052011790	여자	희망	서울시 강남구 	\N	2025-09-22 05:08:14.428	상담확인
47	임혜린	01066411513	여자	자차	김포시	\N	2025-09-24 10:57:59.065	상담확인
48	성주아	01087839604	여자	희망	광명시(광명역)	\N	2025-09-25 22:32:54.644	상담확인
49	은성화	01071021183	여자	자차	양주시	명절전에 연습해보고싶어서 이번주말(내일)부터 주말연습 가능한지 문의드립니다!	2025-09-25 23:54:58.219	상담확인
50	홍희주	01088692544	여자	희망	인천부평	\N	2025-09-26 04:56:35.455	상담확인
51	김가연	010-6393-2045	여자	희망	경기 광명	10시간 수업 비용과, 학원차/자차 반반 수업이 가능한가요? 	2025-09-26 05:50:14.776	상담확인
52	임동준	01041843499	남자	자차	서울시 잠원동	빠르고 정확하게 알려주시면 좋겠습니다	2025-09-26 08:19:27.629	상담확인
53	김은주	01041074416	여자	자차	서울시 중랑구 묵동	수업 일정과 비용, 보험 처리, 자차 진행시 브레이크 관련 내용 등 상담받고싶어서 신청합니다. 	2025-09-27 00:47:27.996	상담확인
54	김은정	01049483020	여자	희망	구리시	면허취득 후 운전경험이 없습니다 시간은 주중가능합니다	2025-09-27 09:57:02.734	상담확인
55	신유라	010-5647-0714	여자	희망	평택시	주말 연수 가능한지 문의드립니다.	2025-09-29 02:50:26.752	상담확인
56	이세은	01085350844	여자	희망	안양시	주 몇일 진행하는지, 요일 선택 가능 여부	2025-09-29 08:11:00.297	상담확인
57	유미숙	01037536564	여자	자차	평택시	\N	2025-10-05 04:51:50.405	상담확인
\.


--
-- Data for Name: Review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Review" (id, rating, title, body, author, email, image, "createdAt", "updatedAt", views) FROM stdin;
2	5	운전의 손맛~~123	주변에 운전을 잘 하는 사람들이 많은 편이라\n\n늘 장롱 면허인 제가 좀 작아보였던 것 같아요;;ㅎㅎ\n\n면허가 있긴 있어도 어디 가서 운전할 수 있다고\n\n말도 못했었는데 이제는 제가 먼저 운전대 잡아요!!!\n\n\n\n얼마 전에는 동생 야근 끝나고 데리러 \n\n나갔다 오기도 했네요ㅎㅎ\n\n이게 다 강사님이 제가 부족한 부분 위주로\n\n기억하기 쉽게 가르쳐 주셔서 가능했던 것 같네요.\n\n주변에도 운전 자체를 몰랐던 사람들이\n\n몇몇 있어서 매니저 연락처 알려주면서 \n\n홍보도 은근히 하고 있답니당~~ㅎㅎ\n\n차근차근 친절히 수업해주셔서 감사합니당~\n\n	문소하			2025-08-29 23:37:03.601	2025-09-07 12:37:57.722	3490
29	5	자차연수 10시간 후기	우선 문의전화도 친절하게 잘받아주시고 \n\n도로연수도 친절하게 잘 설명해주셨습니다\n\n10시간 교육받고 대부도 드라이브 하고 왔습니다\n\n\n\n많이 떨렸지만 기분 최고 네요  \n\n지인 주변분들 타요 추천할게요\n\n\n\n타요드라이브 추천합니다\n\n 	강 원			2025-09-02 04:40:29.772	2025-09-07 12:27:40.324	2523
6	5	나 혼자 운전 성공!!	혼자 멋지게 노래 들으면서 운전하는 나를\n\n상상만했는데\n\n그 상상을 강사님이 현실로 만들어주셨어요\n\n\n\n처음 방문 운전 연수 접했을 때엔 기대반\n\n걱정반 이었어요ㅠㅠ 워낙 운전 자체를 생각만해도\n\n몸에 힘이들어가고 긴장이 되어서요\n\n\n\n그런데 첫날부터 분위기도 편하게 이끌어주시고\n\n천천히 이해하기 쉽게 제 눈높이에 딱맞게 \n\n하나하나 설명해주셔서 맘 편히 수업 마쳤네요\n\n\n\n주차까지 잊지않고 팁 전수해주셔서~ 진짜 이젠\n\n어디든 갈 수 있을 것만 같이 자신감 만땅이에요\n\n조만간 고속도로 위주로 한번 더 수업 듣고 싶어요~\n\n또 연락드릴게요~ 감사해요 쌤!	송미화			2025-08-30 00:18:19.308	2025-09-07 12:37:20.081	3256
31	5	주차극복	주차가 너무 어려워서 항상 차 긁었었는데 강사님 덕분에\n주차 마스터했어요!! 어두운 곳에서도 주차 완벽하게 할 수 있죠!!!\n여유있게 기다려주시고 안정적으로 가르쳐주셔서 편하게 배울 수 있었습니다\n빡빡한 제 스케줄때문에 이틀동안 고생많으셨고 감사합니다^^	오건우		https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9BxqevoSJdh3oWu67AT3RUaSr916Rfh7h7A&s	2025-09-03 14:00:22.164	2025-09-07 12:27:19.924	2115
24	5	10시간 수업	강사님의 따뜻한 격려와 칭찬으로 운전대 잡았습니다\n\n첫날 너무 벌벌 떨어서 포기할려고 했는데\n\n이런 제게 할수있다고 \n\n포기하지말라는 말씀이 큰힘이된거 같아요\n\n\n\n강사님 너무 감사드립니다!!!\n\n 추천할게요 !!!	조현재			2025-08-31 19:02:25.661	2025-09-07 12:28:04.333	2525
1	5	장롱탈출 후기	운전 하는 거 상상만해도 무서웠는데, \n\n운전연수 엄청 오래 받은것도 아닌데, \n\n진짜 빠르게 감을 잡은 것 같아 뿌듯하네요.\n\n\n\n\n\n제가 편한 시간, 원하는 시간대에 요리 조리 골라\n\n수업 들으니까, 뭔가 더 효율적으로 수업을 한 기분이에요.\n\n\n\n은근히 운전 연수 생각하면 막막하고 두렵기만한\n\n장롱면허 초보자 분들도 꽤나 많으실거같아요.\n\n불과 저도 몇주 전까지만해도 벌벌 떨었으니까요.\n\n좀만 용기내셔서 선생님께 도로연수 꼭 여기서 받아보시길 추천해요~!	손미나			2025-08-29 22:58:28.478	2025-09-07 12:38:06.895	3588
3	5	1:1 운전과외 굿~	꼭 방문연수 받아보세요!!\n\n저도 첨엔 운전 하면 운전면허 학원의 존재밖에\n\n몰랐는데 이번에 방문 연수로 \n\n진행해보니 완전 신세계네요~~\n\n\n\n매번 운전 못해서 쭈굴쭈굴한 저를 보더니\n\n언니가 방문연수라도 받아보라면서 알려줬는데\n\n이렇게 편하고 즐겁게 운전 연습이 가능하다니요~\n\n\n\n겁많은 사람으로써 운전은\n\n앞으로 더더 못하겠다\n\n싶었는데~ 일단 딱 첫날부터 \n\n제 문제점 짚어주시고\n\n제가 잘하는 점은 또 칭찬해주시면서 \n\n바로잡아주셔서 진짜 1:1 과외를 받는 기분이었어요!!\n\n\n\n아직 주차는 조금 부족한 듯 하여서 추가 수업도\n\n예약해두었네요. 올해 안에 꼭 자동차 여행까지!! 화이팅!!	오진성			2025-08-29 23:50:07.437	2025-09-07 12:37:41.079	3546
4	5	만년주부 장롱탈출 후기	늘 몇년간 운전이 늘지 않아서\n\n가까운 거리는 운전해도\n\n장거리는 못하고\n\n주차 복잡한 곳은 엄두도 못네는\n\n백만년간 초보운전이었는데요\n\n\n\n강사님이랑 틈틈히 시간 맞춰가면서 수업듣고\n\n집에 와서도 강사님이랑 햇던 코스 고대로~ \n\n반복하면서 복습도 해서 많이 실력 올렸네요\n\n\n\n남편도 이젠 초보 운전 스티커 떼어도 될 정도라면서\n\n엄청 칭찬해주니까 기분도 절로 좋아지네요^^\n\n주변 엄마들에게도 많이 소개할게요! 감사해요!	이현			2025-08-29 23:55:22.531	2025-09-07 12:37:34.639	3495
9	5	 10년 동안 장롱면허로 살던 1인	20살에 운전면허 따고  10년 동안 장롱면허로 있었어요\n\n매해 운전을 해야겠다 생각했는데 마침 \n\n아빠가 새차를 사면서 타던 차를 제가 가지고 왔어요 ^^\n\n아빠한테 하루 배우고 도저히 안되겠다 싶어 \n\n전문적으로 연수 받을 수 있는 곳을 찾다 타요드라이브를 알게 되었어요^^\n\n\n\n좋은강사님을 만나서 10시간 연수 마무리 잘했습니다\n\n모르는 부분이 있으면 언제든 연락해도 된다고도 하셨구요\n\n세심하고 꼼꼼하게 알려주시고 칭찬도 많이 해주시더라구요 \n\n강사님 덕분에  무사히 잘 타고 다니고 있어요~감사합니다^^	김미희			2025-08-30 04:06:21.308	2025-09-07 12:36:50.959	3307
19	5	기초부터 다시 배웠어요~~	운전면허 딴지 5년정도 된 장롱면허여서 많이 긴장됐었는데\n기초부터 차근차근 알려주셔서 잘 배울 수 있었습니다.\n운전 전 기본 셋팅, 좌회전, 우회전, 도로주행, 유턴, 골목길 주행, 차선유지, 차선 변경 등등\n운전하면서 필수적인 요소들을 핵심을 짚어 알려주셔서 빠르고 정확하게 배울 수 있었습니다.\n기본 조작 같은 것도 잘 설명해주셨고, 동네에서 어려워하는 길은 계속 반복해서 연습시켜주셨습니다. 시내 주행연습도 좋았는데 시간이 부족해 고속도로를 가보지 못한게 많이 아쉽습니다…	김아영			2025-08-31 10:33:46.705	2025-09-07 12:34:50.815	2902
10	5	4일 동안 주차까지 완벽!!!	4일 동안 주차 연습과 어려웠던 커브길 주행, \n\n그리고 제가 가고 싶은 곳들과 출퇴근 경로 등을 계속 주행 했습니다 \n\n정말 너무너무 친절하게 잘 가르쳐 주시고 \n\n칭찬과 응원도 많이 해주셔서 운전에 대한 두려움도 극복하고 \n\n자신감도 회복하게 되었습니다.\n\n저 혼자될 때까지 계속해서 반복해서 교육해 주셨는데 많은 도움되었어요\n\n\n\n너무 감사드립니다~~	정다연			2025-08-30 04:32:07.138	2025-09-07 12:36:40.624	3250
7	5	 원하는 코스 ,  맞춤식 수업이 딱 좋았어요	동생이랑 저 둘다 타요에서 배우네요\n\n처음엔 동생이 먼저 연수 배웠어요\n\n동생이 꼼꼼하게 후기도 다 읽어보고 고른\n\n운전연수라고 말해줬는데\n\n확실히 배우고 오더니\n\n실력이 많이 늘었더라고요\n\n\n\n그래서 저도 냉큼 동생 따라 바로 예약하고\n\n제 시간에 맞게 수업 잘받았고\n\n제가 원하는 코스 제 맞춤식 수업이 가능해서 좋았어요\n\n\n\n이제, 자주 가던 그 길은 눈감고도 갈 수 있을 정도~?\n\n무엇보다 편한 분위기로 수업을 이끌어주신 강사님의\n\n덕이 가장 크겠죠~? \n\n다시 한번 감사드려요!	최형민	sdg		2025-08-30 00:28:36.9	2025-09-07 12:37:11.225	3354
16	5	자동차도로연수는 타요 걍츄!!	등록하기전에 검색 엄청 많이 해보고 등록했어요\n\n운전연수업체가 이렇게 많은걸 이번에 알았네요 \n\n사실 어디에다 등록해야할지 햇갈렸는데\n\n주변에 지인이 알려줘서 그거 믿고 등록했는데 확실히 시스템이나 이런부분이 다른방문연수회사하고\n\n다른거같았고  제가 배정받은 강사님또한 굉장히 책임감 있게 해주셨습니다. \n\n\n\n방문운전연수가 사설이다보니 약간 불안한것도 있었는데 \n\n확실히 운전학원대비 가성비는 월등한거 같습니다\n\n\n\n10시간 교육받으니 자신감 정말 많이 붙네요\n\n저는 만족합니다~~	조한주			2025-08-31 08:13:13.827	2025-09-07 12:35:25.511	3253
15	5	10년만에 잡은 운전대	면허 따고 운전 안한지 거의 10년이 되가던 와 중 꼭 운전이 필요한 순간들이 생겨서\n\n큰맘먹고 연수 신청 해봤어요. 제가 운전을 안하게 됐던 이유 중 하나가\n\n저희 집 주차장 때문인데요\n\n이중주차로 인해 베테랑들만 지나갈 수 있을 것 같은 그 좁은 공간을\n\n지나가려니 두려움이 생겨 운전대를 놓게 되더라구요\n\n\n\n그래도 이번에 전문 강사님과 함께하면서 주차장에서 들어가고 나가고 출퇴근코스까지 다녀보면서\n\n자신감이 생겼어요.\n\n브레이크봉으로 잡아주시는데 제가 혼자 할 수 있도록 개입을 많이 안하시더라구요.\n\n그래도 옆에 계시니 든든했습니다	박지현			2025-08-31 08:03:54.187	2025-09-07 12:35:32.039	3155
13	5	초보탈출 (제 차로 출근합니다)	면허 따고 운전을 한 번도 안 해봐서\n운전을 시작하는것 자체가 걱정이었습니다.\n옆에서 마인드컨트롤 해주시고 침착하게 잘 알려주신 강사님 덕분에\n저번주 무사히 연수 끝내고\n드디어 저도 제차로 출근을 햇습니다\n\n저 겁쟁이라서.. 여기 올라온 후기들 다 거짓 같았는데\n진짜 되네요 운전 ㅠㅠㅠ 잘 배우고 갑니다	신희진			2025-08-30 16:08:24.244	2025-09-07 12:36:01.909	2988
12	5	강북운전연수 4일 후기	기초적인 자동차 조작법부터 다양한 실전 상황, \n\n차폭감 잡는 법 등등 운전하면서 필요한 다양한 지식들을 배웠습니다.\n\n또 매우 친절하고 재미있게 알려주셔서 긴 시간 연수가 전혀 지루하지 않았습니다.\n\n장롱면허였는데 운전에 대한 자신감도 생겼고, \n\n앞으로 운전 잘 할 수 있을 것 같습니다.^^\n\n강사님께서 알려주신 것들 되새기며 안전운전 하도록 하겠습니다.\n\n친절히, 그리고 자세히 꼼꼼하게 알려주셔서 감사합니다!!	강승란			2025-08-30 14:47:32.645	2025-09-07 12:36:13.733	3124
11	5	인천에서 연수 받은 10시간 후기	인천에서 연수 받은 김호애 입니다.\n\n연수 받는 동안 귀찮게 이것저것 많이 질문했는데\n\n늘 친절히 가르쳐주신거 다시 감사드리고 싶어요~\n\n\n\n저는 운전대만 잡으면 긴장되어서 진짜 운전이 까마득했는데\n\n드디어 장롱탈출 했네요\n\n\n\n워낙 오래 된 장롱면허 보유자라서 주차는 물론이거니와\n\n주행, 고속도로 운전, 시내 주행 다 복합적으로 문제였는데\n\n다행히 강사님께서 잘 알려주셨어요\n\n\n\n강사님 감사드립니다\n\n	김호애			2025-08-30 05:18:42.237	2025-09-07 12:36:29.199	3209
5	5	택시비 아꼈어요	차가 없어서 매일 택시 타고 다니고...\n\n면허가 있어도 있는 것 같지 않았는데\n\n드디어 2022년 버킷리스트!! 장롱면허 탈출 성공\n\n\n\n전에 학원에서 받아본 연수가 저랑 넘넘 안맞아서\n\n진짜 불편하고 효율도 1도 없었던 기억에\n\n연수를 멀리해왔는데\n\n이번에 타요드라이브 만나 꿀강의 듣게 된 것 같아요^^\n\n\n\n주행 자체에 두려움이 가득했던 저를\n\n이렇게 까지 성장시켜주셔서 감사합니당\n\n앞으로도 열심히 쌤의 가르침 잊지 않을게요\n\n\n\n늘 감사하게 생각하며 임하고 있고 \n\n감사의 마음을 표현하고자 후기를 남깁니다	고세민			2025-08-29 23:55:37.742	2025-09-07 12:37:28.343	3451
18	5	 돈이 아깝지 않습니다^^	22살에 면허 취득 후 7년 동안 장롱면허 상태였습니다.\n\n이번에 충동적으로 차를 구입하게 되어서 급하게 10시간 속성으로 운전연수를 받게 되었습니다.\n\n운전연수를 받기 전만 해도,  엑셀과 브레이크 위치 조차\n\n제대로 기억나지 않았기 때문에 내가 운전을 할 수 있을까라는 막막함에 걱정이 태산 이었습니다.\n\n지인분이 추천해주셔서 카카오톡으로 상담드렸고, 제가 원하는 날짜, 시간 등에 맞추워서 강사님이 연락 주셨습니다.\n\n\n\n첫날은 기본적인 자동차 조작법 부터 시작해서 세부적으로 설명해주셨고 좌회전, 우회전, 유턴 등등 한적한 곳에서 반복연습을 시켜주셨습니다.\n\n2번째 부터는 본격적인 주행 연습을 시켜주셨는데 외각 주행부터 시내 주행까지 순차적으로 알려주셔서 주행하는데 있어 두려움을 완화시킬 수 있었습니다.\n\n\n\n마지막 수업에서는 주차에 대해 핵심적으로 알려주셨는데 강의 중 제일 큰 도움이 되었고 지금까지 한번도 긁힘없이 주차 잘 하고 있습니다.\n\n\n\n 처음에는 가격에 있어서 조금 망설임이 있었는데 연수 끝나고 혼자 주행과 주차 문제 없이 할 수 있게 되어 돈이 아깝지 않은 것 같습니다.	윤여울			2025-08-31 10:21:09.603	2025-09-07 12:35:07.512	2965
14	5	도로주행까지 합격	운전할 때 늘 제 발목을 잡는게 두려움 극복을 못했다는 것이었는데ㅜㅜ\n\n차가 양 옆에서 지나가면 부딪힐 것 같고, \n\n실제로 속도가 빠르지 않은데 너무 빠르게 달리는 것 같기도 하고\n\n결국 무서움을 극복하지 못하니까 늘 면허 취득 \n\n직전에 여러차례 실패의 쓴 맛을 봐야 했어요.ㅜㅜ\n\n\n\n감사하게도 강사님이 제 이런 문제를 딱 집어서 잘 \n\n코칭을 해주셨네요. 제 눈높이, 실력에 딱맞게 수업을 진행해주시더라고요.~~\n\n특히나 저는 아직 면허를 따기 전이라, 도로 주행 시험 코스를\n\n위주로 연습을 했는데. 진짜 디테일하게 제 문제점,\n\n제가 잘하는 점을 알려 주시면서 즐겁게 가르쳐주시더라고요.\n\n\n\n덕분에, 얼마 전에 도로주행시험까지 깔끔하게 잘 보고\n\n면허 취득도 드디어 졸업이네요~ 강사님 정말 감사해요!\n\n운전연수 받게 되면 다시 신청하러 올게용	홍배우리			2025-08-31 06:49:25.89	2025-09-07 12:35:39.1	3084
21	5	될때까지 포기하지 않은 강사님께 진심으로 감사!!	8년 장롱면허에 운전이 너무 무서워서\n상담할때 베테랑 강사님으로 꼭좀 붙여주시라고했어요~ 너무 친절하고 재미있게 알려주셔서 자신감이많이 붙었습니다!^^\n연수중에 많이 답답하셨을텐데 포기하기않고 끝까지 가르쳐주셔서 감사합니다 	채민정			2025-08-31 14:21:42.732	2025-09-07 12:34:34.598	2856
23	5	실속있게 배우고 갑니다~~	면허를 따긴 했지만 부족한 듯 하여 지인에게\n\n이틀정도 연수를 받았어요. \n\n하지만 이걸로는 택도 없....도저히 혼자 차를 끌고 \n\n나가지는 못하겠다 싶어 그냥 면허가 무용지물이 되었는데\n\n\n\n그래도 다행히 친구 추천으로 수업을 4일 진행했네요. 우선 시간을\n\n자유롭게 제 위주로 정할 수 있는 점이 너무 편했어요\n\n\n\n특히 저는 주부라 아이 보고 집안일 하고 운전병행하는 것이 가능할까 했는데\n\n시간 잘 맞춰주셔서 최고!\n\n\n\n게다가 강사님의 수업 진행도 알차서 짧다면 짧은 시간이었는데\n\n정말 실력이 쑥쑥 늘었네요\n\n아직 주차가 좀 어렵지만 매일매일 연습해보려고요 \n\n고맙습니다  샘~!	송혜민 			2025-08-31 18:24:43.528	2025-09-07 12:28:10.156	2639
20	5	타요드라이브 최고!!!	장롱면허 10년이 지나고, 일적으로 운전을 해야할 시기가 왔는데 너무 겁이 났습니다.\n새차를 구매했는데, 막막해서 운전연수를 찾아보다가 우연히 회사동료에게 추천받았어요.\n완전 친절하시고, 유머감각있으셔서 연수하는 내내 즐겁고, 운전에 대한 두려움도 많이 사라진 것 같아요!\n도로에서의 기본적인 매너, 차를 잘 관리하는 방법까지 디테일도 알려주시고 짱입니다!!\n누군가가 장롱면허다, 처음 운전하니까 무섭다고 하면 감히 추천드릴겁니다.	노미리			2025-08-31 10:46:01.348	2025-09-07 12:34:43.939	2780
28	5	100% 만족 합니다!!	면허따고 10년정도 운전을 안해서 \n\n연수신청 했는데 첨엔 너무 긴장되고 겁도 \n\n나서 과연 할수있을까 했는데\n\n3일째정도 되니까 잘하진않아도 \n\n무서움이 많이 없어지고 \n\n조금씩 자신감이 생겼어요.\n\n저희집 주차장이 좀 난코스라 \n\n주차장에서도 많이 연습했는데 \n\n그것도 좋았구요~ \n\n\n\n마지막날 제가 좀더 배웠음하는 부분이 있음 애기하라고도 하셨어요. \n\n\n\n초보자들은 운전하기전에 연수받는게 도움될꺼예요. \n\n몇군데 알아보고 고민끝에 여기서 했는데 만족합니다~	이화영	dd		2025-09-02 04:20:15.914	2025-09-07 12:27:47.469	2669
25	5	몇날며칠 업체만 알아보다가 선택한곳!!	몇날며칠 업체만 알아보다가 선택한곳!!\n\n연수받기위해 눈여겨보던 곳이였는데\n\n참 선택 잘한거 같아요\n\n장롱면허 탈출도 하고 \n\n운전한다는거 자체가 이렇게 성취감이 \n\n클줄 정말몰랐습니다~\n\n남들 다하는운전 저도 드디어하게 되었네요^^ \n\n\n\n그리고  상담해주는분 진짜 고마워요\n\n\n\n카페나 주변에서 불편한 후기성글로\n\n걱정이 많아 많은 질문에 귀찮을만도\n\n했을텐데 다 받아주셨네요\n\n많은분들이 함께하시길 바래요	남연정			2025-09-02 02:48:31.908	2025-09-07 12:27:57.396	2415
22	5	타요드라이브 추천 합니다	우선 5년전 몇번 해보고 다시 해보는 운전이라 긴장도 많이 되고 걱정도 많이 되었는데\n강사님께서 차분히 설명도 잘 해주시고 계속 얘기도 해주시고 편안한 분위기에서\n연수를 잘 받을 수 있었어요.\n\n\n도로주행 중에도 신호나 이런 상황엔 어떻게 해야하는지 제가 실수한 부분도 잘 얘기해주시고\n대충대충 가르쳐주시지 않으시려는 열정이 넘치시는 강사님이신것 같아요~\n\n덕분에 장롱면허 탈출하고 안전하고 즐거운 운전 할 수 있을거 같습니다	이정희	저는		2025-08-31 16:13:21.57	2025-09-07 12:34:27.445	2974
17	5	극한 초보 탈출	강사님 커리큘럼이 제일 마음에 들었어요\n\n같은실수를 하더라도 화내지않고\n\n최대한 안전하게 케어 해주신덕분에\n\n10시간만에 왕초보딱지는 벗어난거 같아요\n\n기초 조작법부터 상세하게 설명해주셔서 감사드립니다\n\n두려움도 극복하고! 자신감 뿜뿜 ㅎㅎ \n\n감사해요   강추입니다!!	박주연			2025-08-31 10:16:36.902	2025-09-07 12:35:16.677	2817
36	5	일산 여강사님께 배운 후기	안녕하세요^^ 운전면허 취득한지는 오래되었는데 바로 운전을 하지않아서 감을 잃어버려 연수받으려고 알아보던중에 타요드라이브 일단지역 여강사님을 소개 받게 되었습니다. 강사님께 배우면서 여러가지 운전팁도 알게되고 운전에 재미를 느낄수 있도록 친절하게 잘 알려주셔서 운전에 대한 두려움이 많이 사라져서 너무 좋아요!!!^^  앞으로도 강실장님이 알려주신 운전에 관한 팁을 기억하면서 안전운전할게요~!!! 고맙습니다!!!	박금비			2025-09-07 09:51:29.386	2025-09-07 12:26:22.693	1900
35	5	만족도 별 다섯개^^	안녕하세요 차 시동 켤줄도 모르고 창문 열 줄 모르던 사람입니다.\n장롱면허로 수년째 묵혀두다가 덜컥 중고차를 사고 출퇴근 해야되서 신청했습니다.\n첨에 선생님 차로 하다가 주차수업때부터 제 차로 했는데, 수업 내내 친절하고 재밌게 잘 가르쳐주셨습니다.\n운전 잘하는 공식이랑 팁들도 많이 들었습니다.\n무엇보다 두려움 없이 자신감있게 운전대 잡을 수 있게 됬어요.\n오늘 고속도로로 서울도 다녀왔는데 재미있었습니다.\n이제 스스로 연습 하다가 만약 또 막히면  타요드라이브에 수원 실장님 찾으려구요~\n감사합니다 - 	정민주			2025-09-06 03:31:06.112	2025-09-07 12:26:34.827	1869
32	5	친절하고 꼼꼼한 설명 감사드립니다.	이번에는 아주 작정을 하고 운전연수 다시 했어요\n이번에는  어떻게든  기필코 운전 성공 할려구요.\n저 두번이나 어영부영 실패했거든요.\n \n처음엔 아빠가 해주다 화내고 그만...\n두번째는 남자 친구가 해주다가 포기...\n그냥 전문가한테 연수 받을라고ㅜㅜ\n남자친구가 찾아서 소개시켜줬어요.\n여기가 친절하대서 했는데 나쁘지 않네요.\n \n하루에 2시간30분씩 4일코스로 교육 진행 했는데\n강사님이 친절하게 자세히 잘 알려주시고\n제가 직접 운전하고 조작하고 연습할수있게 도와줍니다.\n \n내가 주로 자주다닐 도로를 오가며 연습해서도 좋고\n주차도 꼼꼼하게 연습해서 좋았어요.\n제가 운전을 너무 못하는편인데도\n짜증  한번 안내시고  진짜 친절하게  설명 잘 해주시더라구요~\n \n운전연수 10시간 받고 나서 지금은 완벽하게 잘못해도\n근처 마트나 백화점 갈수 있는 실력은 된것 같네요.\n제가 생각해도 성격좋은 강사님 만나서 잘 배운것 같습니다!\n\n강사님! 수고 많으셨습니다~^^	전다영			2025-09-03 17:47:04.994	2025-09-07 12:27:21.499	2478
30	5	 저에게 꼭 맞는 수업이 정말 처음이었답니다~	강사님~ 이렇게 후기로나마 감사인사라도 드려야할 것 같아서요\n\n진짜 제가 나름대로 연수를 많이 받아본,,,ㅎㅎ \n\n나름대로 연수 종류별로 경험한 사람인데 이렇게\n\n저에게 꼭 맞는 수업이 정말 처음이었답니다~\n\n\n\n일단 시간적 여유 시간을 제 위주로 고를 수 있어서\n\n앞뒤 시간 널널하게 수업 들을 수 있어 행복했어요ㅠ\n\n아이키우면서 틈을 내기가 쉽지 않은데\n\n강사님이 많이 편의도 봐주셨네요 ㅎㅎ\n\n\n\n이젠 아이 유치원 등하교도 제 차로 하고\n\n간단한 모임장소 드라이브도 택시 안타고 제차로하니\n\n넘 넘 편하고 좋아요^^\n\n	윤이연			2025-09-02 05:20:25.172	2025-09-07 12:27:33.917	2441
27	5	출퇴근 코스까지 주행 연습	운전을 더 이상 미루면 안 되겠다고 생각하여 검색 후에 후기가 많고 믿을만해서 연수 신청했습니다.\n\n10시간 교육 신청했고 4일간 친절하신 강사님과 운전 연수 진행했습니다 ㅎㅎ\n\n\n\n1일차에는 기본적인 조작법과 주행 꿀팁, 내비게이션 보는 법을 알려주셨습니다. 차량이 많이 없는 곳으로 가서 엑셀과 브레이크 조작법을 익히고 주차 연습도 진행했습니다. 강사님이 친절하고 어렵지 않게 알려주셔서 주차도 쉽게 익힐 수 있었고요!\n\n2일차에는 주차 위주로 많이 연습했습니다. 주행보다 주차가 가장 걱정이었는데 계속 반복해서 연습하다 보니 자신감도 얻고 주차도 잘할 수 있었습니다! 강사님의 주차 꿀팁이 너무 도움이 많이 되었어요!\n\n3일차에는 실제 주행을 진행했습니다. 좌회전, 우회전, 유턴도 익히고, 신호 보는 법, 차선 끼어들기, 차선 맞추기 등 실전 주행에 대한 교육을 진행했습니다. 어느 정도 익숙해진 후 차량이 많은 도로까지 직접 운전해서 원하는 목적지까지 갈 수 있었습니다.\n\n4일차에는 출퇴근 코스에 집중하여 연수했습니다. 언제 차선을 바꿔야 하는지, 도로 특성은 어떤지 등 여러 꿀팁을 많이 알려주셨습니다! 주행도 하고 주차도 하고 마지막 수업도 알차게 마무리했습니다!\n\n\n\n적당히 친절하고 좋은 강사님을 만나 운전에 대한 두려움도 사라지고 자신감도 많이 얻었습니다.\n\n주변에도 추천해 주고 싶습니다	김시원	z		2025-09-02 04:02:26.761	2025-09-07 12:27:52.519	2703
8	5	완벽한 주차 강습	다른 건 다 할만했는데\n\n주차가 참 어렵더라고요\n\n주차 관련 유튜브도 보고 \n\n부모님한테 묻기도 물어봤지만\n\n늘 실전 적용이 어려웠떤 것 같아요\n\n그래도 너무 다행히 강사님을 만나게 되어서\n\n주차 두려움 완벽히 극복한 듯 해요~^^\n\n\n\n강사님은 운전연수를 해주시는 분이라\n\n제 시간 상황에 맞게 융통성있게 스케줄 조정이\n\n가능한 장점이 있었는데요\n\n워낙 들쭉날쭉한 스케줄 근무를\n\n하는 저라서 이렇게 아니면 아마 평생 연수 못받았을 듯요\n\n\n\n그래도 학원보다 밀착 강의 1:1 꼼꼼 강의로 \n\n들으니까 시간 대비 효율이 참 좋더라고요\n\n길지 않은 시간이었는데 정말 단기간에 확\n\n주차실력을 업그레이드 시켰네요\n\n\n\n너무 만족했던 운전연수라 \n\n동료에게도 추천하기도 했어요 ㅎㅎ	한규현			2025-08-30 01:53:09.987	2025-09-07 12:36:58.055	3482
38	5	친절한 강습 감사드립니다	직장 생활을 하다 보니 외근과 출퇴근에 운전이 꼭 필요해 운전연수를 받게 되었습니다.  장롱면허로 오랜만에 운전대를 잡으니 긴장도 많았지만,  강사님께서 침착하게 옆에서 지도해 주셔서  점점 자신감을 얻을 수 있었습니다.  기초 조작부터 차선 변경, 주차, 고속도로 주행까지  실제 상황에 맞게 꼼꼼히 알려주셔서  실력이 빠르게 늘었고, 무엇보다 안전 운전에 대한 감각을 키울 수 있었습니다. 항상 차분하고 친절하게 지도해 주신  강사님께 진심으로 감사드립니다.	김도은			2025-09-07 12:25:30.045	2025-09-07 12:26:06.628	1589
37	5	망설이는 분들께 리얼 추천!	면허를 딴 지는 꽤 되었지만 혼자 운전하기가 두려워 \n항상 대중교통만 이용해 왔습니다. \n그러나 출퇴근과 외근 때문에 더 이상 미룰 수 없다는 \n생각에 운전연수를 신청했는데, \n정말 잘한 선택이었습니다. \n강사님께서 기초부터 차근차근 알려주시고 \n부족한 부분을 반복해서 연습시켜 주셔서 \n빠르게 감을 되찾을 수 있었어요. \n특히 차선 변경, 주차, 돌발 상황 대처 같은 부분을 \n실제 상황처럼 지도해 주신 덕분에 \n지금은 혼자서도 자신 있게 도로에 나설 수 있게 되었습니다. \n항상 친절하고 침착하게 지도해 주신 \n강사님께 진심으로 감사드리며, \n저처럼 망설이던 분들께 꼭 추천드리고 싶습니다.\n	이주원			2025-09-07 12:02:03.631	2025-09-07 12:26:40.724	1825
34	5	가성비도 최고!!	등록하기전에 엄청 많이 검색 해보고 등록했어요~\n운전연수 업체가 이렇게 많은걸 이번에 알았네요..\n다들 같은 광고 같은문구 사실 어디에다 등록해야할지 햇갈렸는데.\n주변에 지인이 여기서 받았었고,\n100% 타요드라이브 직영 강사님들이라\n책임감있게 체계적으로 잘 알려줘서 그거 믿고 등록했는데\n확실히 교육 시스템이나 서비스 최고네요~\n비용도, 확실히 운전학원대비 가성비 탁월하구요~ \n저는 정말 만족합니다 10시간 교육받으니 자신감 정말 많이 붙네요.\n덕분에 멋진 드라이버로 거듭나겠습니다^^	김민성			2025-09-06 03:30:09.458	2025-09-07 12:26:50.605	2742
33	5	운전은 가족,연인들에게 배우지 말자!! ㅎㅎ	주변에 운전하고 다니는 지인들을 보고 장롱면허인 저는 절대 운전을 못한다고 생각했습니다.\n\n\n겁이 많아서 속도도 못내고 엑셀과 브레이크가 뭔지도 모르는 조금 과장해서^^ ((거의 갓난아기....)) 무면허의 상태에서\n\n((택시기사...)) 베스트드라이버 수준으로 정말 4일의 기적을 맛보게 되었습니다.\n\n\n사실 첫 날 연수를 받고 나서 바로 운전해서 나가고 싶은 생각이 들었지만 주차를 할 용기가 없어 못나가고\n\n강사님 오시기만 목빠지게 기다려졌습니다!!!\n\n\n\n운전하면서 긴장도 많이 하는데 긴장하지말라고 재밌는 얘기많이 해주시고 혹시 일어날 여러가지 상황에 도움이 될 대처법들도 많이 가르쳐주셨습니다!!!\n\n그리고 운전시 꿀팁도 많이 알려주셨는데 정말 도움이 많이 됐습니다.\n\n\n처음 면허따면서 배운 운전학원보다 정말 배운것도 많고 그냥 처음부터 여기서 배웠다면 연수따위도 필요 없었을 겁니다\n\n\n너무 좋았던 점은 제가 원하는 코스로 주행연습 완벽히 해주시고 마지막으로 주차까지 완벽히 봐주시는 모습 정말 친절하고 좋았습니다!\n\n\n운전은 가족,연인들에게 배우지말라고 하는 말이 그냥 있는게 아니였습니다.\n\n\n겁도 많고 무서워서 아무것도 할 줄 모르는 저를 하나씩 천천히 친절하게 가르쳐주셔서 감사했습니다.\n\n4일동안 너무 감사했습니다!!!\n	조현성			2025-09-05 12:30:31.634	2025-09-07 12:26:59.252	2330
\.


--
-- Data for Name: Setting; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Setting" (id, "kakaoUrl", "metaTitle", "metaDesc") FROM stdin;
1	hhh		
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
8d38f254-ddf9-4b9f-931d-23944d477603	7312470ce0d7853919004acb6d0d0c1d3172641798b7453d96b2ed9be3cc9b2f	2025-08-29 22:55:02.799927+00	20250828183226_init	\N	\N	2025-08-29 22:55:02.445637+00	1
\.


--
-- Name: Faq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Faq_id_seq"', 1, false);


--
-- Name: Recipient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Recipient_id_seq"', 9, true);


--
-- Name: Reservation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Reservation_id_seq"', 57, true);


--
-- Name: Review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Review_id_seq"', 38, true);


--
-- Name: Setting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Setting_id_seq"', 1, true);


--
-- Name: Faq Faq_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Faq"
    ADD CONSTRAINT "Faq_pkey" PRIMARY KEY (id);


--
-- Name: Recipient Recipient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Recipient"
    ADD CONSTRAINT "Recipient_pkey" PRIMARY KEY (id);


--
-- Name: Reservation Reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Reservation"
    ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY (id);


--
-- Name: Review Review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Review"
    ADD CONSTRAINT "Review_pkey" PRIMARY KEY (id);


--
-- Name: Setting Setting_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Setting"
    ADD CONSTRAINT "Setting_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Recipient_phone_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Recipient_phone_key" ON public."Recipient" USING btree (phone);


--
-- Name: idx_reservation_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservation_created_at ON public."Reservation" USING btree ("createdAt");


--
-- Name: idx_review_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_created_at ON public."Review" USING btree ("createdAt");


--
-- Name: Setting setting_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER setting_set_updated_at BEFORE UPDATE ON public."Setting" FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO cloudsqlsuperuser;


--
-- PostgreSQL database dump complete
--

\unrestrict 3wLGKd1dcAEWZ3EFr1kGR2DcwKk6Uy5fy29sJRpaXLdYUjTDkEPvbGxZnWHiDvt

