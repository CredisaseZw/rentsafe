--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Ubuntu 16.9-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 17.5 (Ubuntu 17.5-1.pgdg24.04+1)

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
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	authtoken	token
7	authtoken	tokenproxy
8	users	customuser
9	users	usersetting
10	users	role
11	common	address
12	common	city
13	common	country
14	common	document
15	common	note
16	common	province
17	common	suburb
18	individuals	employmentdetail
19	individuals	individual
20	individuals	nextofkin
21	companies	company
22	companies	companybranch
23	companies	companyprofile
24	companies	contactperson
25	properties	property
26	properties	propertytype
27	properties	unit
28	leases	guarantor
29	leases	landlord
30	leases	lease
31	leases	leasecharge
32	leases	leaselog
33	leases	leasetenant
34	leases	leasetermination
35	accounting	accountsector
36	accounting	cashbook
37	accounting	cashbookentry
38	accounting	cashsale
39	accounting	creditnote
40	accounting	currency
41	accounting	currencyrate
42	accounting	generalledgeraccount
43	accounting	invoice
44	accounting	journalentry
45	accounting	ledgertransaction
46	accounting	payment
47	accounting	paymentmethod
48	accounting	salesaccount
49	accounting	salescategory
50	accounting	salesitem
51	accounting	transactionlineitem
52	accounting	transactiontype
53	accounting	vatsetting
54	reporting	enquiry
55	reporting	generatedreport
56	reporting	reporttemplate
57	maintenance	maintenancerequest
58	maintenance	maintenanceschedule
59	maintenance	workschedule
60	subscriptions	services
61	subscriptions	subscription
62	subscriptions	subscriptionperiod
63	credit_control	debtcase
64	credit_control	paymentplan
65	credit_control	communicationlog
66	legal	contract
67	legal	contractamendment
68	legal	legaldispute
69	clients	client
70	communications	communication
71	communications	reminder
72	communications	debtorintelligencenote
73	communications	communicationhistoryreminder
74	communications	otp
75	communications	communicationattachment
76	communications	commshistmessage
77	legal	claim
78	legal	activecredit
79	django_celery_beat	crontabschedule
80	django_celery_beat	intervalschedule
81	django_celery_beat	periodictask
82	django_celery_beat	periodictasks
83	django_celery_beat	solarschedule
84	django_celery_beat	clockedschedule
85	django_celery_results	taskresult
86	django_celery_results	chordcounter
87	django_celery_results	groupresult
88	individuals	individualcontactdetail
\.


--
-- Data for Name: client; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.client (id, client_type, client_object_id, name, status, external_client_id, date_created, date_modified, client_content_type_id, created_by_id) FROM stdin;
1	INDIVIDUAL_USER	123	Optional Custom Name	ACTIVE	be357b70-94c8-4a3b-807d-556aaebeb6c4	2025-07-18 15:15:16.992277+02	2025-07-18 15:15:16.992295+02	19	\N
2	COMPANY_USER	1	Optional Company Display Name	ACTIVE	fa37c083-f5df-43a7-b713-605a5924e2cf	2025-07-18 15:26:18.807624+02	2025-07-19 15:04:44.372813+02	22	\N
\.


--
-- Data for Name: users_customuser; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_customuser (id, password, is_superuser, username, first_name, last_name, is_staff, is_active, date_joined, email, is_verified, profile_picture, last_password_change, profile_object_id, can_send_email, last_login, client_id, profile_content_type_id) FROM stdin;
1	pbkdf2_sha256$870000$0jxHnjjGnuvYOKWlVVTSDc$NCHp50NsE4Varm3OfA+bKnIwhKou6O/zi4yN99tfz8Y=	t	admin@admin.com			t	t	2025-07-11 11:59:40+02	admin@admin.com	t		\N	\N	t	2025-07-22 09:00:44.155107+02	\N	\N
5	pbkdf2_sha256$600000$DQnexVihGRauhjwUQVT08z$zPAqF9ADzyZoGru3dHUuwHNWZ9XaPQSmeaqVaR5fNvo=	f	test@example.com	Test	User	t	t	2025-07-19 14:33:14.266673+02	test@example.com	f		\N	\N	t	2025-07-19 14:33:14.266841+02	2	\N
15	pbkdf2_sha256$600000$cBtHjkyWEyurrdqvzRWibG$pAS/A/l5HyuMYiNl4IcKq661gUXPByyBdQyvATyAWE0=	f	gtkandeya@gmail.com	John	Doe	f	t	2025-07-19 17:29:00.471049+02	gtkandeya@gmail.com	f		\N	\N	t	2025-07-19 17:29:00.471184+02	2	\N
\.


--
-- Data for Name: accounting_accountsector; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_accountsector (id, date_created, date_updated, name, code, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_currency; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_currency (id, date_created, date_updated, currency_code, currency_name, user_id) FROM stdin;
1	2025-07-22 14:14:36.150933+02	2025-07-22 14:14:36.150956+02	USD	United States Dollar	\N
2	2025-07-22 14:14:36.16279+02	2025-07-22 14:14:36.162806+02	EUR	Euro	\N
3	2025-07-22 14:14:36.169725+02	2025-07-22 14:14:36.169743+02	GBP	British Pound	\N
4	2025-07-22 14:14:36.176547+02	2025-07-22 14:14:36.176568+02	ZWL	Zimbabwean Dollar	\N
5	2025-07-22 14:14:36.182304+02	2025-07-22 14:14:36.182323+02	ZAR	South African Rand	\N
\.


--
-- Data for Name: accounting_generalledgeraccount; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_generalledgeraccount (id, date_created, date_updated, account_name, account_number, account_sector_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_cashbook; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_cashbook (id, date_created, date_updated, cashbook_id, cashbook_name, requisition_status, account_type, bank_account_number, branch_name, currency_id, general_ledger_account_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_transactiontype; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_transactiontype (id, date_created, date_updated, transaction_type, description, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_cashbookentry; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_cashbookentry (id, date_created, date_updated, transaction_date, amount, description, transaction_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_paymentmethod; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_paymentmethod (id, date_created, date_updated, payment_method_name, user_id) FROM stdin;
1	2025-07-11 12:44:18.066544+02	2025-07-11 12:44:18.066588+02	CASH USD	\N
2	2025-07-11 12:44:18.071341+02	2025-07-11 12:44:18.071357+02	SWIPE USD	\N
3	2025-07-11 12:44:18.075246+02	2025-07-11 12:44:18.075266+02	SWIPE ZIG	\N
4	2025-07-11 12:44:18.078959+02	2025-07-11 12:44:18.078977+02	BANK TRF USD	\N
5	2025-07-11 12:44:18.086026+02	2025-07-11 12:44:18.086046+02	BANK TRF ZIG	\N
6	2025-07-11 12:44:18.093752+02	2025-07-11 12:44:18.093773+02	ECOCASH USD	\N
7	2025-07-11 12:44:18.100054+02	2025-07-11 12:44:18.100078+02	ECOCASH ZIG	\N
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.company (id, date_created, date_updated, registration_number, registration_name, trading_name, legal_status, date_of_incorporation, industry, is_verified, is_active, is_deleted, user_id) FROM stdin;
3	2025-07-14 11:42:23.569983+02	2025-07-14 11:42:23.570011+02	2023/123456/03	Tech Solutions (Pty) Ltd 2	TechSol	private	2023-01-15	Information Technology	f	t	f	\N
1	2025-07-11 16:51:10.517452+02	2025-07-14 12:06:58.389072+02	\N	Minimal Test	\N	private	\N	\N	t	f	t	\N
2	2025-07-14 11:38:15.825197+02	2025-07-16 16:46:58.554954+02	2023/123456/07	New Company Name 2	NewTrade 2	private	2023-01-15	Information Technology	f	t	f	1
10	2025-07-18 09:44:55.777859+02	2025-07-18 09:44:55.777876+02	COMP123	ABC Corporation	ABC Corp	private	2020-01-01	Technology	f	t	f	1
12	2025-07-18 09:50:56.887069+02	2025-07-18 09:50:56.887087+02	COMP123/25	ABC Corporation 2	ABC Corp	private	2020-01-01	Technology	f	t	f	1
13	2025-07-18 09:52:07.747126+02	2025-07-18 09:52:07.74714+02	COMP125	ABC Corp	\N	private	\N	\N	f	t	f	1
14	2025-07-18 10:01:55.736076+02	2025-07-18 10:01:55.7361+02	COMP123/26	ABC Corporation 3	ABC Corp	private	2020-01-01	Technology	f	t	f	1
15	2025-07-18 10:16:22.830971+02	2025-07-18 10:16:22.830988+02	COMP123/27	ABC Corporation 4	ABC Corp	private	2020-01-01	Technology	f	t	f	1
16	2025-07-18 10:44:41.417087+02	2025-07-18 10:44:41.417103+02	COMP123/28	ABC Corporation 5	ABC Corp	private	2020-01-01	Technology	f	t	f	1
17	2025-07-18 11:30:05.720249+02	2025-07-18 11:30:05.720272+02	COMP123/29	ABC Corporation 6	ABC Corp	private	2020-01-01	Technology	f	t	f	1
19	2025-07-22 11:08:02.041461+02	2025-07-22 11:08:02.041986+02	csdvv	Fincheck PVT LTD	Fincheck PVT LTD		\N		f	t	f	1
20	2025-07-22 11:12:54.212458+02	2025-07-22 11:12:54.212523+02	KU-12D-Fx	lomagundi sales			\N		f	t	f	1
21	2025-07-22 11:23:21.037142+02	2025-07-22 11:23:21.037216+02	32RFF	BP petroleum			\N		f	t	f	1
22	2025-07-22 11:28:16.289467+02	2025-07-22 11:28:16.289477+02	fdfv	maize prod pvt ltd	maize prod		\N		f	t	f	1
23	2025-07-22 13:09:27.819981+02	2025-07-22 13:09:27.820185+02	R-213-32-FRF1	Castle Breweries Pvt Ltd	Castle Breweries	private	2025-07-01	Manufacturing	f	t	f	1
\.


--
-- Data for Name: individual; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.individual (id, date_created, date_updated, first_name, last_name, date_of_birth, gender, identification_type, identification_number, is_verified, is_active, is_deleted, user_id, marital_status) FROM stdin;
25	2025-07-21 10:30:18.824257+02	2025-07-21 10:30:18.824335+02	Samson	James	1992-12-15	male	national_id	762123456F16	f	t	f	1	divorced
3	2025-07-14 14:36:36.530087+02	2025-07-21 11:16:43.482698+02	Elder	Maluva	1992-12-15	male	national_id	44123456F46	f	f	f	\N	\N
2	2025-07-14 11:55:56.930448+02	2025-07-14 14:12:16.338277+02	SeHl	Maluva	1992-12-15	male	national_id	34123456F46	f	t	f	\N	\N
4	2025-07-14 14:37:59.877562+02	2025-07-14 14:37:59.877576+02	SeHl	Maluva	1992-12-15	male	national_id	46123456F46	f	t	f	\N	\N
8	2025-07-14 15:22:07.021232+02	2025-07-14 15:22:07.021253+02	Selo	Maluva	1992-12-15	male	national_id	87123456F46	f	t	f	\N	\N
9	2025-07-15 11:50:51.245093+02	2025-07-15 11:50:51.245164+02	Selol	Maluva	1992-12-15	male	national_id	87123456F56	f	t	f	\N	\N
10	2025-07-15 11:54:55.661589+02	2025-07-15 11:54:55.661624+02	Selol	Maluva	1992-12-15	male	national_id	87123456F57	f	t	f	\N	\N
11	2025-07-15 14:29:21.390262+02	2025-07-15 14:29:21.390284+02	SeHl	Maluva	1992-12-15	male	national_id	342123456F46	f	t	f	\N	\N
24	2025-07-21 08:55:50.528785+02	2025-07-21 11:50:24.71713+02	Samson	James	1992-12-15	male	national_id	762123456F13	t	t	f	1	divorced
18	2025-07-18 12:05:21.486864+02	2025-07-18 12:05:21.486879+02	John	Doe	1992-12-15	male	national_id	462123456F00	t	t	f	1	\N
26	2025-07-21 15:57:11.488249+02	2025-07-21 15:57:11.488265+02	Samson	James	1992-12-15	male	national_id	56F13	f	t	f	1	divorced
27	2025-07-21 16:26:03.894717+02	2025-07-21 16:26:03.894739+02	Samson	Kudos	1992-12-15	male	national_id	762123s56F13	f	t	f	1	divorced
12	2025-07-17 15:20:47.907408+02	2025-07-17 15:20:47.907426+02	SeHl	Maluva	1992-12-15	male	national_id	442123456F46	f	t	f	1	\N
13	2025-07-17 15:21:36.007565+02	2025-07-17 15:21:36.007608+02	SeHl	Maluva	1992-12-15	male	national_id	442123456F40	f	t	f	1	\N
17	2025-07-18 11:54:52.532476+02	2025-07-18 11:54:52.532502+02	SeHl	Maluva	1992-12-15	male	national_id	442123456F00	f	t	f	1	\N
19	2025-07-18 12:26:13.945711+02	2025-07-18 12:26:13.945735+02	Smith	Doe	1992-12-15	male	national_id	462123456F01	f	t	f	1	\N
5	2025-07-14 14:55:27.341358+02	2025-07-18 14:45:15.712554+02	Selo	Maluva	1992-12-15	male	national_id	57123456F46	f	f	t	\N	\N
30	2025-07-22 09:36:57.337987+02	2025-07-22 09:36:57.338003+02	Samson	James	1992-12-15	male	national_id	762123456F15	f	t	f	1	divorced
1	2025-07-11 14:27:17.179312+02	2025-07-18 15:08:10.846751+02	Seh	Maluva	1992-12-15	male	national_id	23123456F45	f	t	f	1	\N
31	2025-07-22 09:42:05.537295+02	2025-07-22 09:42:05.537343+02	Samson	James	1992-12-15	male	national_id	7621234566F125	f	t	f	1	divorced
7	2025-07-14 15:20:21.155975+02	2025-07-18 16:46:15.758553+02	Selo	Maluva	1992-12-15	male	national_id	77123456F46	f	t	f	1	\N
32	2025-07-22 09:50:02.766004+02	2025-07-22 09:50:02.766022+02	Samson	James	1992-12-15	male	national_id	76212345661295	f	t	f	1	divorced
6	2025-07-14 15:16:56.39006+02	2025-07-18 15:13:58.758153+02	Selo	Maluva	1992-12-15	male	national_id	67123456F46	f	t	f	1	\N
33	2025-07-22 10:19:17.19529+02	2025-07-22 10:19:17.195309+02	Samson	James	1992-12-15	male	national_id	7621234566129544	f	t	f	1	divorced
20	2025-07-18 12:27:00.458854+02	2025-07-18 16:50:45.299517+02	Samuellll	Doe	1992-12-15	male	national_id	462123456F04	f	t	f	1	divorced
21	2025-07-18 17:00:49.984647+02	2025-07-18 17:00:49.984715+02	Samuel	Doe	1992-12-15	male	national_id	762123456F04	f	t	f	1	divorced
34	2025-07-22 10:27:05.807549+02	2025-07-22 10:27:05.807593+02	Samson	James	1992-12-15	male	national_id	762123456612953344	f	t	f	1	divorced
22	2025-07-21 08:33:24.645635+02	2025-07-21 08:35:16.059615+02	Samuel	John	1992-12-15	male	national_id	762123456F11	f	t	f	1	divorced
35	2025-07-22 10:51:14.49318+02	2025-07-22 10:51:14.493273+02	Samson	James	1992-12-15	male	national_id	762123456612953ws344	f	t	f	1	divorced
36	2025-07-22 11:05:09.008945+02	2025-07-22 11:05:09.009419+02	Samson	James	1992-12-15	male	national_id	762123456d44	f	t	f	1	divorced
37	2025-07-22 14:41:58.028348+02	2025-07-22 15:56:36.880856+02	Samuellll	Doe	1992-12-15	male	national_id	722123456D44	f	t	f	1	divorced
\.


--
-- Data for Name: accounting_cashsale; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_cashsale (id, date_created, date_updated, document_number, sale_date, is_individual, quantity, total_excluding_vat, discount, vat_total, invoice_total, details, reference, amount_received, cashbook_id, company_id, currency_id, individual_id, payment_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_creditnote; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_creditnote (id, date_created, date_updated, credit_date, document_number, is_individual, total_amount, description, company_id, currency_id, individual_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_currencyrate; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_currencyrate (id, date_created, date_updated, current_rate, base_currency_id, currency_id, user_id) FROM stdin;
\.


--
-- Data for Name: guarantor; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.guarantor (id, date_created, date_updated, object_id, guarantee_amount, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: properties_propertytype; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.properties_propertytype (id, date_created, date_updated, name, description, user_id) FROM stdin;
\.


--
-- Data for Name: properties_property; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.properties_property (id, date_created, date_updated, name, description, status, year_built, total_area, is_furnished, property_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: properties_unit; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.properties_unit (id, date_created, date_updated, unit_number, unit_type, floor_number, bedrooms, bathrooms, area, status, monthly_rent, deposit_amount, features, property_id, user_id) FROM stdin;
\.


--
-- Data for Name: leases_lease; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.leases_lease (id, date_created, date_updated, lease_id, start_date, end_date, signed_date, status, deposit_amount, deposit_period, payment_frequency, due_day_of_month, grace_period_days, includes_utilities, utilities_details, account_number, currency_id, guarantor_id, landlord_id, unit_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_invoice; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_invoice (id, date_created, date_updated, invoice_type, document_number, is_individual, status, reference_number, discount, is_recurring, frequency, next_invoice_date, sale_date, company_id, currency_id, individual_id, lease_id, original_invoice_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_journalentry; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_journalentry (id, date_created, date_updated, date, description, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_ledgertransaction; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_ledgertransaction (id, date_created, date_updated, debit, credit, account_id, entry_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_payment; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_payment (id, date_created, date_updated, payment_date, amount, reference, invoice_id, method_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_salesaccount; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_salesaccount (id, date_created, date_updated, account_name, account_number, account_sector_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_salescategory; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_salescategory (id, date_created, date_updated, name, code, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_vatsetting; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_vatsetting (id, date_created, date_updated, rate, description, vat_applicable, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_salesitem; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_salesitem (id, date_created, date_updated, item_id, name, price, unit_name, category_id, sales_account_id, tax_configuration_id, unit_price_currency_id, user_id) FROM stdin;
\.


--
-- Data for Name: accounting_transactionlineitem; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.accounting_transactionlineitem (id, date_created, date_updated, object_id, quantity, unit_price, vat_amount, total_price, content_type_id, sales_item_id, user_id) FROM stdin;
\.


--
-- Data for Name: active_credit; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.active_credit (id, date_created, date_updated, date_time, dr_object_id, cr_object_id, due_date, start_date, end_date, details, amount, balance, status, payment_date, type, cr_content_type_id, dr_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add Token	6	add_token
22	Can change Token	6	change_token
23	Can delete Token	6	delete_token
24	Can view Token	6	view_token
25	Can add token	7	add_tokenproxy
26	Can change token	7	change_tokenproxy
27	Can delete token	7	delete_tokenproxy
28	Can view token	7	view_tokenproxy
29	Can add Custom User	8	add_customuser
30	Can change Custom User	8	change_customuser
31	Can delete Custom User	8	delete_customuser
32	Can view Custom User	8	view_customuser
33	Can add user setting	9	add_usersetting
34	Can change user setting	9	change_usersetting
35	Can delete user setting	9	delete_usersetting
36	Can view user setting	9	view_usersetting
37	Can add role	10	add_role
38	Can change role	10	change_role
39	Can delete role	10	delete_role
40	Can view role	10	view_role
41	Can add address	11	add_address
42	Can change address	11	change_address
43	Can delete address	11	delete_address
44	Can view address	11	view_address
45	Can add city	12	add_city
46	Can change city	12	change_city
47	Can delete city	12	delete_city
48	Can view city	12	view_city
49	Can add country	13	add_country
50	Can change country	13	change_country
51	Can delete country	13	delete_country
52	Can view country	13	view_country
53	Can add Document	14	add_document
54	Can change Document	14	change_document
55	Can delete Document	14	delete_document
56	Can view Document	14	view_document
57	Can add Note	15	add_note
58	Can change Note	15	change_note
59	Can delete Note	15	delete_note
60	Can view Note	15	view_note
61	Can add province	16	add_province
62	Can change province	16	change_province
63	Can delete province	16	delete_province
64	Can view province	16	view_province
65	Can add suburb	17	add_suburb
66	Can change suburb	17	change_suburb
67	Can delete suburb	17	delete_suburb
68	Can view suburb	17	view_suburb
69	Can add employment detail	18	add_employmentdetail
70	Can change employment detail	18	change_employmentdetail
71	Can delete employment detail	18	delete_employmentdetail
72	Can view employment detail	18	view_employmentdetail
73	Can add individual	19	add_individual
74	Can change individual	19	change_individual
75	Can delete individual	19	delete_individual
76	Can view individual	19	view_individual
77	Can add next of kin	20	add_nextofkin
78	Can change next of kin	20	change_nextofkin
79	Can delete next of kin	20	delete_nextofkin
80	Can view next of kin	20	view_nextofkin
81	Can add company	21	add_company
82	Can change company	21	change_company
83	Can delete company	21	delete_company
84	Can view company	21	view_company
85	Can add company branch	22	add_companybranch
86	Can change company branch	22	change_companybranch
87	Can delete company branch	22	delete_companybranch
88	Can view company branch	22	view_companybranch
89	Can add Company Profile	23	add_companyprofile
90	Can change Company Profile	23	change_companyprofile
91	Can delete Company Profile	23	delete_companyprofile
92	Can view Company Profile	23	view_companyprofile
93	Can add Contact Person	24	add_contactperson
94	Can change Contact Person	24	change_contactperson
95	Can delete Contact Person	24	delete_contactperson
96	Can view Contact Person	24	view_contactperson
97	Can add property	25	add_property
98	Can change property	25	change_property
99	Can delete property	25	delete_property
100	Can view property	25	view_property
101	Can add base model	26	add_propertytype
102	Can change base model	26	change_propertytype
103	Can delete base model	26	delete_propertytype
104	Can view base model	26	view_propertytype
105	Can add unit	27	add_unit
106	Can change unit	27	change_unit
107	Can delete unit	27	delete_unit
108	Can view unit	27	view_unit
109	Can add guarantor	28	add_guarantor
110	Can change guarantor	28	change_guarantor
111	Can delete guarantor	28	delete_guarantor
112	Can view guarantor	28	view_guarantor
113	Can add base model	29	add_landlord
114	Can change base model	29	change_landlord
115	Can delete base model	29	delete_landlord
116	Can view base model	29	view_landlord
117	Can add lease	30	add_lease
118	Can change lease	30	change_lease
119	Can delete lease	30	delete_lease
120	Can view lease	30	view_lease
121	Can add lease charge	31	add_leasecharge
122	Can change lease charge	31	change_leasecharge
123	Can delete lease charge	31	delete_leasecharge
124	Can view lease charge	31	view_leasecharge
125	Can add lease log	32	add_leaselog
126	Can change lease log	32	change_leaselog
127	Can delete lease log	32	delete_leaselog
128	Can view lease log	32	view_leaselog
129	Can add lease tenant	33	add_leasetenant
130	Can change lease tenant	33	change_leasetenant
131	Can delete lease tenant	33	delete_leasetenant
132	Can view lease tenant	33	view_leasetenant
133	Can add lease termination	34	add_leasetermination
134	Can change lease termination	34	change_leasetermination
135	Can delete lease termination	34	delete_leasetermination
136	Can view lease termination	34	view_leasetermination
137	Can add base model	35	add_accountsector
138	Can change base model	35	change_accountsector
139	Can delete base model	35	delete_accountsector
140	Can view base model	35	view_accountsector
141	Can add base model	36	add_cashbook
142	Can change base model	36	change_cashbook
143	Can delete base model	36	delete_cashbook
144	Can view base model	36	view_cashbook
145	Can add base model	37	add_cashbookentry
146	Can change base model	37	change_cashbookentry
147	Can delete base model	37	delete_cashbookentry
148	Can view base model	37	view_cashbookentry
149	Can add base model	38	add_cashsale
150	Can change base model	38	change_cashsale
151	Can delete base model	38	delete_cashsale
152	Can view base model	38	view_cashsale
153	Can add base model	39	add_creditnote
154	Can change base model	39	change_creditnote
155	Can delete base model	39	delete_creditnote
156	Can view base model	39	view_creditnote
157	Can add base model	40	add_currency
158	Can change base model	40	change_currency
159	Can delete base model	40	delete_currency
160	Can view base model	40	view_currency
161	Can add base model	41	add_currencyrate
162	Can change base model	41	change_currencyrate
163	Can delete base model	41	delete_currencyrate
164	Can view base model	41	view_currencyrate
165	Can add base model	42	add_generalledgeraccount
166	Can change base model	42	change_generalledgeraccount
167	Can delete base model	42	delete_generalledgeraccount
168	Can view base model	42	view_generalledgeraccount
169	Can add base model	43	add_invoice
170	Can change base model	43	change_invoice
171	Can delete base model	43	delete_invoice
172	Can view base model	43	view_invoice
173	Can add base model	44	add_journalentry
174	Can change base model	44	change_journalentry
175	Can delete base model	44	delete_journalentry
176	Can view base model	44	view_journalentry
177	Can add base model	45	add_ledgertransaction
178	Can change base model	45	change_ledgertransaction
179	Can delete base model	45	delete_ledgertransaction
180	Can view base model	45	view_ledgertransaction
181	Can add base model	46	add_payment
182	Can change base model	46	change_payment
183	Can delete base model	46	delete_payment
184	Can view base model	46	view_payment
185	Can add base model	47	add_paymentmethod
186	Can change base model	47	change_paymentmethod
187	Can delete base model	47	delete_paymentmethod
188	Can view base model	47	view_paymentmethod
189	Can add base model	48	add_salesaccount
190	Can change base model	48	change_salesaccount
191	Can delete base model	48	delete_salesaccount
192	Can view base model	48	view_salesaccount
193	Can add base model	49	add_salescategory
194	Can change base model	49	change_salescategory
195	Can delete base model	49	delete_salescategory
196	Can view base model	49	view_salescategory
197	Can add base model	50	add_salesitem
198	Can change base model	50	change_salesitem
199	Can delete base model	50	delete_salesitem
200	Can view base model	50	view_salesitem
201	Can add Transaction Line Item	51	add_transactionlineitem
202	Can change Transaction Line Item	51	change_transactionlineitem
203	Can delete Transaction Line Item	51	delete_transactionlineitem
204	Can view Transaction Line Item	51	view_transactionlineitem
205	Can add base model	52	add_transactiontype
206	Can change base model	52	change_transactiontype
207	Can delete base model	52	delete_transactiontype
208	Can view base model	52	view_transactiontype
209	Can add base model	53	add_vatsetting
210	Can change base model	53	change_vatsetting
211	Can delete base model	53	delete_vatsetting
212	Can view base model	53	view_vatsetting
213	Can add Enquiry	54	add_enquiry
214	Can change Enquiry	54	change_enquiry
215	Can delete Enquiry	54	delete_enquiry
216	Can view Enquiry	54	view_enquiry
217	Can add generated report	55	add_generatedreport
218	Can change generated report	55	change_generatedreport
219	Can delete generated report	55	delete_generatedreport
220	Can view generated report	55	view_generatedreport
221	Can add report template	56	add_reporttemplate
222	Can change report template	56	change_reporttemplate
223	Can delete report template	56	delete_reporttemplate
224	Can view report template	56	view_reporttemplate
225	Can add base model	57	add_maintenancerequest
226	Can change base model	57	change_maintenancerequest
227	Can delete base model	57	delete_maintenancerequest
228	Can view base model	57	view_maintenancerequest
229	Can add Maintenance Schedule	58	add_maintenanceschedule
230	Can change Maintenance Schedule	58	change_maintenanceschedule
231	Can delete Maintenance Schedule	58	delete_maintenanceschedule
232	Can view Maintenance Schedule	58	view_maintenanceschedule
233	Can add Work Schedule	59	add_workschedule
234	Can change Work Schedule	59	change_workschedule
235	Can delete Work Schedule	59	delete_workschedule
236	Can view Work Schedule	59	view_workschedule
237	Can add service	60	add_services
238	Can change service	60	change_services
239	Can delete service	60	delete_services
240	Can view service	60	view_services
241	Can add subscription	61	add_subscription
242	Can change subscription	61	change_subscription
243	Can delete subscription	61	delete_subscription
244	Can view subscription	61	view_subscription
245	Can add subscription period	62	add_subscriptionperiod
246	Can change subscription period	62	change_subscriptionperiod
247	Can delete subscription period	62	delete_subscriptionperiod
248	Can view subscription period	62	view_subscriptionperiod
249	Can add base model	63	add_debtcase
250	Can change base model	63	change_debtcase
251	Can delete base model	63	delete_debtcase
252	Can view base model	63	view_debtcase
253	Can add base model	64	add_paymentplan
254	Can change base model	64	change_paymentplan
255	Can delete base model	64	delete_paymentplan
256	Can view base model	64	view_paymentplan
257	Can add base model	65	add_communicationlog
258	Can change base model	65	change_communicationlog
259	Can delete base model	65	delete_communicationlog
260	Can view base model	65	view_communicationlog
261	Can add contract	66	add_contract
262	Can change contract	66	change_contract
263	Can delete contract	66	delete_contract
264	Can view contract	66	view_contract
265	Can add contract amendment	67	add_contractamendment
266	Can change contract amendment	67	change_contractamendment
267	Can delete contract amendment	67	delete_contractamendment
268	Can view contract amendment	67	view_contractamendment
269	Can add legal dispute	68	add_legaldispute
270	Can change legal dispute	68	change_legaldispute
271	Can delete legal dispute	68	delete_legaldispute
272	Can view legal dispute	68	view_legaldispute
273	Can add Client	69	add_client
274	Can change Client	69	change_client
275	Can delete Client	69	delete_client
276	Can view Client	69	view_client
277	Can add communication	70	add_communication
278	Can change communication	70	change_communication
279	Can delete communication	70	delete_communication
280	Can view communication	70	view_communication
281	Can add reminder	71	add_reminder
282	Can change reminder	71	change_reminder
283	Can delete reminder	71	delete_reminder
284	Can view reminder	71	view_reminder
285	Can add Debtor Intelligence Note	72	add_debtorintelligencenote
286	Can change Debtor Intelligence Note	72	change_debtorintelligencenote
287	Can delete Debtor Intelligence Note	72	delete_debtorintelligencenote
288	Can view Debtor Intelligence Note	72	view_debtorintelligencenote
289	Can add Communication History Reminder	73	add_communicationhistoryreminder
290	Can change Communication History Reminder	73	change_communicationhistoryreminder
291	Can delete Communication History Reminder	73	delete_communicationhistoryreminder
292	Can view Communication History Reminder	73	view_communicationhistoryreminder
293	Can add OTP	74	add_otp
294	Can change OTP	74	change_otp
295	Can delete OTP	74	delete_otp
296	Can view OTP	74	view_otp
297	Can add communication attachment	75	add_communicationattachment
298	Can change communication attachment	75	change_communicationattachment
299	Can delete communication attachment	75	delete_communicationattachment
300	Can view communication attachment	75	view_communicationattachment
301	Can add Communication Message	76	add_commshistmessage
302	Can change Communication Message	76	change_commshistmessage
303	Can delete Communication Message	76	delete_commshistmessage
304	Can view Communication Message	76	view_commshistmessage
305	Can add Claim	77	add_claim
306	Can change Claim	77	change_claim
307	Can delete Claim	77	delete_claim
308	Can view Claim	77	view_claim
309	Can add Financial Entry	78	add_activecredit
310	Can change Financial Entry	78	change_activecredit
311	Can delete Financial Entry	78	delete_activecredit
312	Can view Financial Entry	78	view_activecredit
313	Can add crontab	79	add_crontabschedule
314	Can change crontab	79	change_crontabschedule
315	Can delete crontab	79	delete_crontabschedule
316	Can view crontab	79	view_crontabschedule
317	Can add interval	80	add_intervalschedule
318	Can change interval	80	change_intervalschedule
319	Can delete interval	80	delete_intervalschedule
320	Can view interval	80	view_intervalschedule
321	Can add periodic task	81	add_periodictask
322	Can change periodic task	81	change_periodictask
323	Can delete periodic task	81	delete_periodictask
324	Can view periodic task	81	view_periodictask
325	Can add periodic tasks	82	add_periodictasks
326	Can change periodic tasks	82	change_periodictasks
327	Can delete periodic tasks	82	delete_periodictasks
328	Can view periodic tasks	82	view_periodictasks
329	Can add solar event	83	add_solarschedule
330	Can change solar event	83	change_solarschedule
331	Can delete solar event	83	delete_solarschedule
332	Can view solar event	83	view_solarschedule
333	Can add clocked	84	add_clockedschedule
334	Can change clocked	84	change_clockedschedule
335	Can delete clocked	84	delete_clockedschedule
336	Can view clocked	84	view_clockedschedule
337	Can add task result	85	add_taskresult
338	Can change task result	85	change_taskresult
339	Can delete task result	85	delete_taskresult
340	Can view task result	85	view_taskresult
341	Can add chord counter	86	add_chordcounter
342	Can change chord counter	86	change_chordcounter
343	Can delete chord counter	86	delete_chordcounter
344	Can view chord counter	86	view_chordcounter
345	Can add group result	87	add_groupresult
346	Can change group result	87	change_groupresult
347	Can delete group result	87	delete_groupresult
348	Can view group result	87	view_groupresult
349	Can add contact detail	88	add_individualcontactdetail
350	Can change contact detail	88	change_individualcontactdetail
351	Can delete contact detail	88	delete_individualcontactdetail
352	Can view contact detail	88	view_individualcontactdetail
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.authtoken_token (key, created, user_id) FROM stdin;
\.


--
-- Data for Name: claim; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.claim (id, date_created, date_updated, creditor_object_id, debtor_object_id, data_source, account_number, amount, claim_date, creditor_content_type_id, currency_id, debtor_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: common_country; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_country (id, date_created, date_updated, name, code, slug, dial_code, currency_code, currency_name, is_active, user_id) FROM stdin;
3	2025-07-11 12:44:37.360692+02	2025-07-11 12:56:57.730628+02	Namibia	NAM	namibia	264	NAD	Namibian Dollar	t	\N
4	2025-07-11 12:44:37.371493+02	2025-07-11 12:56:57.737827+02	Nigeria	NGA	nigeria	234	NGN	Naira	t	\N
5	2025-07-11 12:44:37.38059+02	2025-07-11 12:56:57.745231+02	South Africa	ZAF	south-africa	27	ZAR	Rand	t	\N
6	2025-07-11 12:44:37.389345+02	2025-07-11 12:56:57.752785+02	Zambia	ZM	zambia	260	ZMW	Zambian Kwacha	t	\N
7	2025-07-11 12:44:37.396169+02	2025-07-11 12:56:57.759402+02	Zimbabwe	ZW	zimbabwe	263	ZWG	Zimbabwe Gold	t	\N
8	2025-07-15 09:21:39.856108+02	2025-07-15 09:30:39.867401+02	Zimbabwe	ZWE	zimbabwe-1	+263	ZWL	Zimbabwean Dollar	f	\N
9	2025-07-15 12:06:35.015499+02	2025-07-15 12:06:35.015517+02	Naiga	NGA	naiga	+26	USD	United States Dollar	t	\N
10	2025-07-15 12:57:20.39249+02	2025-07-16 13:22:36.944003+02	Kenya	KYA	kenya	+260	SHL	Kenyan  Shillings	f	1
1	2025-07-11 12:44:37.338942+02	2025-07-16 15:35:21.317522+02	Malawi	MWI	malawi	265	SHx	Kenyan  Shillings	t	1
2	2025-07-11 12:44:37.350704+02	2025-07-18 10:47:50.111084+02	Mozambique	MOZ	mozambique	258	MZH	Mozambique Metical	t	1
\.


--
-- Data for Name: common_province; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_province (id, date_created, date_updated, slug, name, code, is_active, approved, country_id, user_id) FROM stdin;
25	2025-07-15 09:36:29.137942+02	2025-07-15 09:45:48.096199+02	test-province	Test Province	TPP	f	f	8	\N
14	2025-07-11 12:44:37.627981+02	2025-07-16 16:22:05.280404+02	blantyre	Blantyre	MLW	t	f	1	1
1	2025-07-11 12:44:37.428754+02	2025-07-11 12:56:57.773435+02	harare	Harare	HRE	t	t	7	\N
2	2025-07-11 12:44:37.447001+02	2025-07-11 12:56:57.779936+02	bulawayo	Bulawayo	BUL	t	t	7	\N
3	2025-07-11 12:44:37.46618+02	2025-07-11 12:56:57.788629+02	manicaland	Manicaland	MAN	t	t	7	\N
4	2025-07-11 12:44:37.48076+02	2025-07-11 12:56:57.799693+02	masvingo	Masvingo	MAS	t	t	7	\N
5	2025-07-11 12:44:37.49339+02	2025-07-11 12:56:57.808788+02	mashonaland-east	Mashonaland East	MAE	t	t	7	\N
6	2025-07-11 12:44:37.508373+02	2025-07-11 12:56:57.817983+02	mashonaland-central	Mashonaland Central	MAC	t	t	7	\N
7	2025-07-11 12:44:37.522787+02	2025-07-11 12:56:57.828686+02	mashonaland-west	Mashonaland West	MAW	t	t	7	\N
8	2025-07-11 12:44:37.532511+02	2025-07-11 12:56:57.835794+02	midlands	Midlands	MID	t	t	7	\N
9	2025-07-11 12:44:37.546942+02	2025-07-11 12:56:57.842783+02	matebeleland-north	Matebeleland North	MNA	t	t	7	\N
10	2025-07-11 12:44:37.562019+02	2025-07-11 12:56:57.852172+02	matebeleland-south	Matebeleland South	MSA	t	t	7	\N
11	2025-07-11 12:44:37.577348+02	2025-07-11 12:56:57.858659+02	gauteng	Gauteng	GT	t	f	5	\N
12	2025-07-11 12:44:37.593039+02	2025-07-11 12:56:57.867878+02	western-cape	Western Cape	WC	t	f	5	\N
13	2025-07-11 12:44:37.60584+02	2025-07-11 12:56:57.878356+02	kwazulu-natal	Kwazulu Natal	KZN	t	f	5	\N
15	2025-07-11 12:44:37.645216+02	2025-07-11 12:56:57.899049+02	cabo-delgado	Cabo Delgado	CDG	t	f	2	\N
16	2025-07-11 12:44:37.658541+02	2025-07-11 12:56:57.905441+02	maputo	Maputo	MAP	t	f	2	\N
17	2025-07-11 12:44:37.676601+02	2025-07-11 12:56:57.917097+02	gaza	Gaza	GAZ	t	f	2	\N
18	2025-07-11 12:44:37.69648+02	2025-07-11 12:56:57.923901+02	inhambane	Inhambane	INH	t	f	2	\N
19	2025-07-11 12:44:37.70665+02	2025-07-11 12:56:57.931964+02	manica	Manica	MNC	t	f	2	\N
20	2025-07-11 12:44:37.719667+02	2025-07-11 12:56:57.937929+02	nampula	Nampula	NAP	t	f	2	\N
21	2025-07-11 12:44:37.732335+02	2025-07-11 12:56:57.945187+02	niassa	Niassa	NIA	t	f	2	\N
22	2025-07-11 12:44:37.743797+02	2025-07-11 12:56:57.954019+02	sofala	Sofala	SOF	t	f	2	\N
23	2025-07-11 12:44:37.755749+02	2025-07-11 12:56:57.962088+02	tete	Tete	TET	t	f	2	\N
24	2025-07-11 12:44:37.765975+02	2025-07-11 12:56:57.973763+02	zambezia	Zambezia	ZAM	t	f	2	\N
\.


--
-- Data for Name: common_city; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_city (id, date_created, date_updated, slug, name, is_active, province_id, user_id) FROM stdin;
183	2025-07-15 09:48:14.43713+02	2025-07-15 09:48:14.437154+02	mbare	Mbare	t	1	\N
2	2025-07-11 12:47:09.645263+02	2025-07-11 12:56:58.007724+02	ruwa	Ruwa	t	1	\N
7	2025-07-11 12:47:09.717239+02	2025-07-15 09:53:26.992095+02	chipinge	Cyber City	t	1	\N
181	2025-07-11 12:47:12.990418+02	2025-07-11 12:47:12.990448+02	harare-1	Harare	t	7	\N
1	2025-07-11 12:47:09.629157+02	2025-07-11 12:56:57.996112+02	chitungwiza	Chitungwiza	t	1	\N
3	2025-07-11 12:47:09.659501+02	2025-07-11 12:56:58.020047+02	harare	Harare	t	1	\N
4	2025-07-11 12:47:09.67731+02	2025-07-11 12:56:58.033821+02	bulawayo	Bulawayo	t	2	\N
5	2025-07-11 12:47:09.691084+02	2025-07-11 12:56:58.046038+02	buhera	Buhera	t	3	\N
6	2025-07-11 12:47:09.704191+02	2025-07-11 12:56:58.05811+02	chimanimani	Chimanimani	t	3	\N
8	2025-07-11 12:47:09.732986+02	2025-07-11 12:56:58.084297+02	headlands	Headlands	t	3	\N
9	2025-07-11 12:47:09.751561+02	2025-07-11 12:56:58.096606+02	juliasdale	Juliasdale	t	3	\N
10	2025-07-11 12:47:09.764622+02	2025-07-11 12:56:58.108489+02	makoni	Makoni	t	3	\N
11	2025-07-11 12:47:09.781368+02	2025-07-11 12:56:58.119535+02	musikavanhu	Musikavanhu	t	3	\N
12	2025-07-11 12:47:09.79487+02	2025-07-11 12:56:58.130413+02	mutare	Mutare	t	3	\N
13	2025-07-11 12:47:09.810668+02	2025-07-11 12:56:58.144774+02	nyanga	Nyanga	t	3	\N
14	2025-07-11 12:47:09.823693+02	2025-07-11 12:56:58.154378+02	rusape	Rusape	t	3	\N
15	2025-07-11 12:47:09.837311+02	2025-07-11 12:56:58.166069+02	vumba	Vumba	t	3	\N
16	2025-07-11 12:47:09.851917+02	2025-07-11 12:56:58.182323+02	penhalonga	Penhalonga	t	3	\N
17	2025-07-11 12:47:09.868407+02	2025-07-11 12:56:58.19209+02	bikita	Bikita	t	4	\N
18	2025-07-11 12:47:09.884415+02	2025-07-11 12:56:58.202591+02	chiredzi	Chiredzi	t	4	\N
19	2025-07-11 12:47:09.901708+02	2025-07-11 12:56:58.214642+02	gutu	Gutu	t	4	\N
20	2025-07-11 12:47:09.922399+02	2025-07-11 12:56:58.22333+02	masvingo	Masvingo	t	4	\N
21	2025-07-11 12:47:09.943742+02	2025-07-11 12:56:58.239921+02	mwenezi	Mwenezi	t	4	\N
22	2025-07-11 12:47:09.965041+02	2025-07-11 12:56:58.2541+02	rutenga	Rutenga	t	4	\N
23	2025-07-11 12:47:09.980385+02	2025-07-11 12:56:58.27032+02	triangle	Triangle	t	4	\N
24	2025-07-11 12:47:10.005575+02	2025-07-11 12:56:58.280975+02	zaka	Zaka	t	4	\N
25	2025-07-11 12:47:10.027766+02	2025-07-11 12:56:58.296374+02	arcturus	Arcturus	t	5	\N
26	2025-07-11 12:47:10.044919+02	2025-07-11 12:56:58.307587+02	beatrice	Beatrice	t	5	\N
27	2025-07-11 12:47:10.060815+02	2025-07-11 12:56:58.320676+02	chikomba	Chikomba	t	5	\N
28	2025-07-11 12:47:10.080653+02	2025-07-11 12:56:58.335564+02	chivhu	Chivhu	t	5	\N
29	2025-07-11 12:47:10.101636+02	2025-07-11 12:56:58.35154+02	damofalls	Damofalls	t	5	\N
30	2025-07-11 12:47:10.126701+02	2025-07-11 12:56:58.367026+02	goromonzi	Goromonzi	t	5	\N
31	2025-07-11 12:47:10.144273+02	2025-07-11 12:56:58.377997+02	marondera	Marondera	t	5	\N
32	2025-07-11 12:47:10.169113+02	2025-07-11 12:56:58.387927+02	mudzi	Mudzi	t	5	\N
33	2025-07-11 12:47:10.189036+02	2025-07-11 12:56:58.397333+02	murehwa	Murehwa	t	5	\N
34	2025-07-11 12:47:10.220006+02	2025-07-11 12:56:58.411634+02	mutoko	Mutoko	t	5	\N
35	2025-07-11 12:47:10.244715+02	2025-07-11 12:56:58.422039+02	seke	Seke	t	5	\N
36	2025-07-11 12:47:10.264936+02	2025-07-11 12:56:58.438998+02	wedza	Wedza	t	5	\N
37	2025-07-11 12:47:10.282104+02	2025-07-11 12:56:58.448637+02	domboshawa	Domboshawa	t	5	\N
38	2025-07-11 12:47:10.304368+02	2025-07-11 12:56:58.463274+02	dema	Dema	t	5	\N
39	2025-07-11 12:47:10.323081+02	2025-07-11 12:56:58.477197+02	macheke	Macheke	t	5	\N
40	2025-07-11 12:47:10.344877+02	2025-07-11 12:56:58.488134+02	bindura	Bindura	t	6	\N
41	2025-07-11 12:47:10.359343+02	2025-07-11 12:56:58.505324+02	centenary	Centenary	t	6	\N
42	2025-07-11 12:47:10.373004+02	2025-07-11 12:56:58.515224+02	christon	Christon	t	6	\N
43	2025-07-11 12:47:10.388636+02	2025-07-11 12:56:58.52305+02	concession	Concession	t	6	\N
44	2025-07-11 12:47:10.409522+02	2025-07-11 12:56:58.539689+02	guruve	Guruve	t	6	\N
45	2025-07-11 12:47:10.4243+02	2025-07-11 12:56:58.556502+02	mazowe	Mazowe	t	6	\N
46	2025-07-11 12:47:10.443884+02	2025-07-11 12:56:58.570483+02	mt-darwin	Mt Darwin	t	6	\N
47	2025-07-11 12:47:10.462266+02	2025-07-11 12:56:58.579977+02	mvurwi	Mvurwi	t	6	\N
48	2025-07-11 12:47:10.474141+02	2025-07-11 12:56:58.589619+02	rushinga	Rushinga	t	6	\N
49	2025-07-11 12:47:10.487068+02	2025-07-11 12:56:58.602772+02	shamva	Shamva	t	6	\N
50	2025-07-11 12:47:10.498995+02	2025-07-11 12:56:58.618879+02	mbire	Mbire	t	6	\N
51	2025-07-11 12:47:10.511115+02	2025-07-11 12:56:58.63286+02	banket	Banket	t	7	\N
52	2025-07-11 12:47:10.53414+02	2025-07-11 12:56:58.646665+02	chegutu	Chegutu	t	7	\N
53	2025-07-11 12:47:10.553942+02	2025-07-11 12:56:58.657928+02	chinhoyi	Chinhoyi	t	7	\N
54	2025-07-11 12:47:10.572237+02	2025-07-11 12:56:58.670949+02	chirundu	Chirundu	t	7	\N
55	2025-07-11 12:47:10.593877+02	2025-07-11 12:56:58.688807+02	darwendale	Darwendale	t	7	\N
56	2025-07-11 12:47:10.6139+02	2025-07-11 12:56:58.701061+02	hurungwe	Hurungwe	t	7	\N
57	2025-07-11 12:47:10.637236+02	2025-07-11 12:56:58.713208+02	kadoma	Kadoma	t	7	\N
58	2025-07-11 12:47:10.651188+02	2025-07-11 12:56:58.723155+02	kariba	Kariba	t	7	\N
59	2025-07-11 12:47:10.666987+02	2025-07-11 12:56:58.73337+02	karoi	Karoi	t	7	\N
60	2025-07-11 12:47:10.693596+02	2025-07-11 12:56:58.747987+02	lake	Lake	t	7	\N
61	2025-07-11 12:47:10.715382+02	2025-07-11 12:56:58.759097+02	lower	Lower	t	7	\N
62	2025-07-11 12:47:10.737397+02	2025-07-11 12:56:58.774079+02	makonde	Makonde	t	7	\N
63	2025-07-11 12:47:10.764704+02	2025-07-11 12:56:58.786256+02	mazvikadei	Mazvikadei	t	7	\N
64	2025-07-11 12:47:10.789742+02	2025-07-11 12:56:58.800178+02	norton	Norton	t	7	\N
65	2025-07-11 12:47:10.818477+02	2025-07-11 12:56:58.808199+02	zambezi	Zambezi	t	7	\N
66	2025-07-11 12:47:10.844026+02	2025-07-11 12:56:58.819828+02	zvimba	Zvimba	t	7	\N
67	2025-07-11 12:47:10.860713+02	2025-07-11 12:56:58.834587+02	selous	Selous	t	7	\N
68	2025-07-11 12:47:10.87631+02	2025-07-11 12:56:58.845752+02	raffingora	Raffingora	t	7	\N
69	2025-07-11 12:47:10.900009+02	2025-07-11 12:56:58.857067+02	mhangura	Mhangura	t	7	\N
70	2025-07-11 12:47:10.917622+02	2025-07-11 12:56:58.866913+02	chirumhanzu	Chirumhanzu	t	8	\N
71	2025-07-11 12:47:10.934418+02	2025-07-11 12:56:58.878018+02	gokwe	Gokwe	t	8	\N
72	2025-07-11 12:47:10.951085+02	2025-07-11 12:56:58.888928+02	gweru	Gweru	t	8	\N
73	2025-07-11 12:47:10.96762+02	2025-07-11 12:56:58.901652+02	kwekwe	Kwekwe	t	8	\N
74	2025-07-11 12:47:10.980752+02	2025-07-11 12:56:58.909955+02	mberengwa	Mberengwa	t	8	\N
75	2025-07-11 12:47:10.994675+02	2025-07-11 12:56:58.922152+02	redcliff	Redcliff	t	8	\N
76	2025-07-11 12:47:11.009267+02	2025-07-11 12:56:58.935455+02	shurugwi	Shurugwi	t	8	\N
77	2025-07-11 12:47:11.024492+02	2025-07-11 12:56:58.944475+02	zvishavane	Zvishavane	t	8	\N
78	2025-07-11 12:47:11.039213+02	2025-07-11 12:56:58.952678+02	mvuma	Mvuma	t	8	\N
79	2025-07-11 12:47:11.054331+02	2025-07-11 12:56:58.964703+02	binga	Binga	t	9	\N
80	2025-07-11 12:47:11.070544+02	2025-07-11 12:56:58.976828+02	bubi	Bubi	t	9	\N
81	2025-07-11 12:47:11.08455+02	2025-07-11 12:56:58.98729+02	deka	Deka	t	9	\N
82	2025-07-11 12:47:11.096567+02	2025-07-11 12:56:58.999689+02	hwange	Hwange	t	9	\N
83	2025-07-11 12:47:11.111623+02	2025-07-11 12:56:59.012728+02	lupane	Lupane	t	9	\N
84	2025-07-11 12:47:11.129747+02	2025-07-11 12:56:59.022042+02	msuna	Msuna	t	9	\N
85	2025-07-11 12:47:11.144937+02	2025-07-11 12:56:59.03494+02	nkayi	Nkayi	t	9	\N
86	2025-07-11 12:47:11.160242+02	2025-07-11 12:56:59.045633+02	tsholotsho	Tsholotsho	t	9	\N
87	2025-07-11 12:47:11.176764+02	2025-07-11 12:56:59.056037+02	umguza	Umguza	t	9	\N
88	2025-07-11 12:47:11.190572+02	2025-07-11 12:56:59.069819+02	victoria-falls	Victoria Falls	t	9	\N
89	2025-07-11 12:47:11.206675+02	2025-07-11 12:56:59.08332+02	beitbridge	Beitbridge	t	10	\N
90	2025-07-11 12:47:11.226378+02	2025-07-11 12:56:59.094903+02	bulilimamangwe	Bulilimamangwe	t	10	\N
91	2025-07-11 12:47:11.242158+02	2025-07-11 12:56:59.105415+02	figtree	Figtree	t	10	\N
92	2025-07-11 12:47:11.254311+02	2025-07-11 12:56:59.11768+02	gwanda	Gwanda	t	10	\N
93	2025-07-11 12:47:11.272907+02	2025-07-11 12:56:59.128584+02	insiza	Insiza	t	10	\N
94	2025-07-11 12:47:11.286308+02	2025-07-11 12:56:59.139892+02	matobo	Matobo	t	10	\N
95	2025-07-11 12:47:11.299011+02	2025-07-11 12:56:59.150543+02	plumtree	Plumtree	t	10	\N
96	2025-07-11 12:47:11.313433+02	2025-07-11 12:56:59.159635+02	shangani	Shangani	t	10	\N
97	2025-07-11 12:47:11.331699+02	2025-07-11 12:56:59.170903+02	umzingwane	Umzingwane	t	10	\N
98	2025-07-11 12:47:11.34988+02	2025-07-11 12:56:59.18296+02	johannesburg	Johannesburg	t	11	\N
99	2025-07-11 12:47:11.365317+02	2025-07-11 12:56:59.194751+02	pretoria	Pretoria	t	11	\N
100	2025-07-11 12:47:11.37759+02	2025-07-11 12:56:59.206761+02	cape-town	Cape Town	t	12	\N
101	2025-07-11 12:47:11.394318+02	2025-07-11 12:56:59.217175+02	hillcrest	Hillcrest	t	13	\N
102	2025-07-11 12:47:11.413024+02	2025-07-11 12:56:59.2282+02	kloof	Kloof	t	13	\N
103	2025-07-11 12:47:11.43613+02	2025-07-11 12:56:59.241245+02	waterfall	Waterfall	t	13	\N
104	2025-07-11 12:47:11.451989+02	2025-07-11 12:56:59.256028+02	gillitts	Gillitts	t	13	\N
105	2025-07-11 12:47:11.482124+02	2025-07-11 12:56:59.268621+02	assagay	Assagay	t	13	\N
106	2025-07-11 12:47:11.50708+02	2025-07-11 12:56:59.278595+02	bothas-hill	Bothas Hill	t	13	\N
107	2025-07-11 12:47:11.527608+02	2025-07-11 12:56:59.288939+02	crestholme	Crestholme	t	13	\N
108	2025-07-11 12:47:11.543881+02	2025-07-11 12:56:59.298976+02	summerveld	Summerveld	t	13	\N
109	2025-07-11 12:47:11.561549+02	2025-07-11 12:56:59.314148+02	mangochi	Mangochi	t	14	\N
110	2025-07-11 12:47:11.57934+02	2025-07-11 12:56:59.32873+02	mangochi-town-center	Mangochi Town Center	t	14	\N
111	2025-07-11 12:47:11.597971+02	2025-07-11 12:56:59.342577+02	mangochi-township	Mangochi Township	t	14	\N
112	2025-07-11 12:47:11.613973+02	2025-07-11 12:56:59.354086+02	mponda	Mponda	t	14	\N
113	2025-07-11 12:47:11.631924+02	2025-07-11 12:56:59.364093+02	maldeco	Maldeco	t	14	\N
114	2025-07-11 12:47:11.650693+02	2025-07-11 12:56:59.379447+02	mbwadzulu	Mbwadzulu	t	14	\N
115	2025-07-11 12:47:11.669059+02	2025-07-11 12:56:59.392996+02	chiponde	Chiponde	t	14	\N
116	2025-07-11 12:47:11.68942+02	2025-07-11 12:56:59.410138+02	nankumba	Nankumba	t	14	\N
117	2025-07-11 12:47:11.703728+02	2025-07-11 12:56:59.422115+02	chilipa	Chilipa	t	14	\N
118	2025-07-11 12:47:11.723667+02	2025-07-11 12:56:59.438961+02	mangochi-boma	Mangochi Boma	t	14	\N
119	2025-07-11 12:47:11.745837+02	2025-07-11 12:56:59.452846+02	pemba	Pemba	t	15	\N
120	2025-07-11 12:47:11.764837+02	2025-07-11 12:56:59.466987+02	montepuez	Montepuez	t	15	\N
121	2025-07-11 12:47:11.783911+02	2025-07-11 12:56:59.482336+02	mocimboa-da-praia	Mocímboa da Praia	t	15	\N
122	2025-07-11 12:47:11.802538+02	2025-07-11 12:56:59.496348+02	palma	Palma	t	15	\N
123	2025-07-11 12:47:11.815953+02	2025-07-11 12:56:59.510635+02	macomia	Macomia	t	15	\N
124	2025-07-11 12:47:11.830182+02	2025-07-11 12:56:59.526008+02	quissanga	Quissanga	t	15	\N
125	2025-07-11 12:47:11.845743+02	2025-07-11 12:56:59.540944+02	metuge	Metuge	t	15	\N
126	2025-07-11 12:47:11.859237+02	2025-07-11 12:56:59.555246+02	chiure	Chiúre	t	15	\N
127	2025-07-11 12:47:11.8738+02	2025-07-11 12:56:59.568242+02	ancuabe	Ancuabe	t	15	\N
128	2025-07-11 12:47:11.898628+02	2025-07-11 12:56:59.583641+02	ibo	Ibo	t	15	\N
129	2025-07-11 12:47:11.912623+02	2025-07-11 12:56:59.60257+02	mueda	Mueda	t	15	\N
130	2025-07-11 12:47:11.935864+02	2025-07-11 12:56:59.615317+02	meluco	Meluco	t	15	\N
131	2025-07-11 12:47:11.952834+02	2025-07-11 12:56:59.631401+02	centro	Centro	t	15	\N
132	2025-07-11 12:47:11.966415+02	2025-07-11 12:56:59.642471+02	paquitequete	Paquitequete	t	15	\N
133	2025-07-11 12:47:11.983995+02	2025-07-11 12:56:59.654843+02	murrebue	Murrebue	t	15	\N
134	2025-07-11 12:47:12.00067+02	2025-07-11 12:56:59.668536+02	chali	Chali	t	15	\N
135	2025-07-11 12:47:12.02067+02	2025-07-11 12:56:59.685182+02	cimento	Cimento	t	15	\N
136	2025-07-11 12:47:12.038856+02	2025-07-11 12:56:59.709607+02	ponta-vermelha	Ponta Vermelha	t	15	\N
137	2025-07-11 12:47:12.063128+02	2025-07-11 12:56:59.729664+02	bairro-novo	Bairro Novo	t	15	\N
138	2025-07-11 12:47:12.082766+02	2025-07-11 12:56:59.755609+02	nanhime	Nanhime	t	15	\N
139	2025-07-11 12:47:12.103615+02	2025-07-11 12:56:59.791077+02	murrupula	Murrupula	t	15	\N
140	2025-07-11 12:47:12.117221+02	2025-07-11 12:56:59.80949+02	muapula	Muapula	t	15	\N
141	2025-07-11 12:47:12.133149+02	2025-07-11 12:56:59.832453+02	mutiva	Mutiva	t	15	\N
142	2025-07-11 12:47:12.156385+02	2025-07-11 12:56:59.854507+02	muiuane	Muiuane	t	15	\N
143	2025-07-11 12:47:12.175203+02	2025-07-11 12:56:59.871854+02	mussoromosso	Mussoromosso	t	15	\N
144	2025-07-11 12:47:12.191621+02	2025-07-11 12:56:59.88737+02	alto-da-manga	Alto da Manga	t	15	\N
145	2025-07-11 12:47:12.207172+02	2025-07-11 12:56:59.89875+02	mia-couto	Mia Couto	t	15	\N
146	2025-07-11 12:47:12.228475+02	2025-07-11 12:56:59.908197+02	baixa	Baixa	t	15	\N
147	2025-07-11 12:47:12.247971+02	2025-07-11 12:56:59.921569+02	mucojo	Mucojo	t	15	\N
148	2025-07-11 12:47:12.26516+02	2025-07-11 12:56:59.931899+02	manilha	Manilha	t	15	\N
149	2025-07-11 12:47:12.279744+02	2025-07-11 12:56:59.945063+02	areias	Areias	t	15	\N
150	2025-07-11 12:47:12.299316+02	2025-07-11 12:56:59.958473+02	quibuidine	Quibuidine	t	15	\N
151	2025-07-11 12:47:12.317681+02	2025-07-11 12:56:59.971169+02	zona-verde	Zona Verde	t	15	\N
152	2025-07-11 12:47:12.337637+02	2025-07-11 12:56:59.983955+02	nova-vida	Nova Vida	t	15	\N
153	2025-07-11 12:47:12.36362+02	2025-07-11 12:56:59.997319+02	quelimane	Quelimane	t	15	\N
154	2025-07-11 12:47:12.38617+02	2025-07-11 12:57:00.009074+02	muxungue	Muxúnguè	t	15	\N
155	2025-07-11 12:47:12.411011+02	2025-07-11 12:57:00.020768+02	pangane	Pangane	t	15	\N
156	2025-07-11 12:47:12.426936+02	2025-07-11 12:57:00.030485+02	matemo	Matemo	t	15	\N
157	2025-07-11 12:47:12.447256+02	2025-07-11 12:57:00.039391+02	quionga	Quionga	t	15	\N
158	2025-07-11 12:47:12.463316+02	2025-07-11 12:57:00.055235+02	mecufi	Mecufi	t	15	\N
159	2025-07-11 12:47:12.481406+02	2025-07-11 12:57:00.070546+02	nacotuco	Nacotuco	t	15	\N
160	2025-07-11 12:47:12.499193+02	2025-07-11 12:57:00.086283+02	mecula	Mecula	t	15	\N
161	2025-07-11 12:47:12.517382+02	2025-07-11 12:57:00.09837+02	meza	Meza	t	15	\N
162	2025-07-11 12:47:12.53406+02	2025-07-11 12:57:00.109769+02	nairoto	Nairoto	t	15	\N
163	2025-07-11 12:47:12.555589+02	2025-07-11 12:57:00.127768+02	mpunga	M'punga	t	15	\N
164	2025-07-11 12:47:12.579485+02	2025-07-11 12:57:00.142797+02	cobaia	Cobaia	t	15	\N
165	2025-07-11 12:47:12.600607+02	2025-07-11 12:57:00.153808+02	napupa	Napupa	t	15	\N
166	2025-07-11 12:47:12.625182+02	2025-07-11 12:57:00.168998+02	napapa	Napapa	t	15	\N
167	2025-07-11 12:47:12.651481+02	2025-07-11 12:57:00.178745+02	nacujo	Nacujo	t	15	\N
168	2025-07-11 12:47:12.676946+02	2025-07-11 12:57:00.191011+02	napome	Napome	t	15	\N
169	2025-07-11 12:47:12.694478+02	2025-07-11 12:57:00.20372+02	nagaze	Nagaze	t	15	\N
170	2025-07-11 12:47:12.722489+02	2025-07-11 12:57:00.218262+02	porto	Porto	t	15	\N
171	2025-07-11 12:47:12.749979+02	2025-07-11 12:57:00.230779+02	fortaleza	Fortaleza	t	15	\N
172	2025-07-11 12:47:12.773669+02	2025-07-11 12:57:00.24635+02	cabo	Cabo	t	15	\N
173	2025-07-11 12:47:12.789263+02	2025-07-11 12:57:00.256602+02	makuti	Makuti	t	15	\N
174	2025-07-11 12:47:12.811263+02	2025-07-11 12:57:00.268456+02	administrative-center	Administrative Center	t	15	\N
175	2025-07-11 12:47:12.849393+02	2025-07-11 12:57:00.281295+02	local-villages	Local Villages	t	15	\N
176	2025-07-11 12:47:12.8714+02	2025-07-11 12:57:00.294599+02	rural-communities	Rural Communities	t	15	\N
177	2025-07-11 12:47:12.888908+02	2025-07-11 12:57:00.30413+02	agricultural-areas	Agricultural Areas	t	15	\N
178	2025-07-11 12:47:12.91551+02	2025-07-11 12:57:00.318292+02	market-centers	Market Centers	t	15	\N
179	2025-07-11 12:47:12.939168+02	2025-07-11 12:57:00.332293+02	traditional-communal-areas	Traditional Communal Areas	t	15	\N
180	2025-07-11 12:47:12.958089+02	2025-07-11 12:57:00.342669+02	maputo	Maputo	t	16	\N
182	2025-07-11 12:57:00.361928+02	2025-07-11 12:57:00.361953+02	harare-1-2	Harare	t	7	\N
\.


--
-- Data for Name: common_suburb; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_suburb (id, date_created, date_updated, name, slug, is_active, city_id, user_id) FROM stdin;
531	2025-07-15 10:10:01.468541+02	2025-07-15 10:10:01.468556+02	Mount Pleasant New	mount-pleasant-new	t	1	\N
184	2025-07-11 12:47:18.536278+02	2025-07-15 10:19:42.742571+02	Mount Pleasant New 2	ilanda	f	1	\N
94	2025-07-11 12:47:15.383629+02	2025-07-11 12:57:01.934369+02	Msasa Park	msasa-park	t	3	\N
95	2025-07-11 12:47:15.405098+02	2025-07-11 12:57:01.949808+02	Mainway Meadows	mainway-meadows	t	3	\N
186	2025-07-11 12:47:18.599138+02	2025-07-11 12:57:03.668606+02	Kensington Byo	kensington-byo	t	4	\N
279	2025-07-11 12:47:22.600899+02	2025-07-11 12:57:05.301159+02	Makoni	makoni	t	10	\N
280	2025-07-11 12:47:22.629024+02	2025-07-11 12:57:05.317868+02	Musikavanhu	musikavanhu	t	11	\N
289	2025-07-11 12:47:22.887041+02	2025-07-11 12:57:05.451098+02	Utopia	utopia	t	12	\N
388	2025-07-11 12:47:25.653435+02	2025-07-11 12:47:25.653467+02	Athlone	athlone-1	t	72	\N
437	2025-07-11 12:47:26.933175+02	2025-07-11 12:47:26.933201+02	Hillcrest	hillcrest-1	t	101	\N
521	2025-07-11 12:47:29.035485+02	2025-07-11 12:47:29.035511+02	Baixa	baixa-1	t	180	\N
1	2025-07-11 12:47:13.025949+02	2025-07-11 12:57:00.395+02	Chitungwiza	chitungwiza	t	1	\N
2	2025-07-11 12:47:13.048345+02	2025-07-11 12:57:00.412318+02	Ruwa	ruwa	t	2	\N
3	2025-07-11 12:47:13.068677+02	2025-07-11 12:57:00.436582+02	Harare City Center	harare-city-center	t	3	\N
4	2025-07-11 12:47:13.110083+02	2025-07-11 12:57:00.453682+02	Amby	amby	t	3	\N
5	2025-07-11 12:47:13.130672+02	2025-07-11 12:57:00.474891+02	Athlone	athlone	t	3	\N
6	2025-07-11 12:47:13.153237+02	2025-07-11 12:57:00.490992+02	Eastlea	eastlea	t	3	\N
7	2025-07-11 12:47:13.17953+02	2025-07-11 12:57:00.511168+02	Greendale	greendale	t	3	\N
8	2025-07-11 12:47:13.197576+02	2025-07-11 12:57:00.522382+02	Greengrove	greengrove	t	3	\N
9	2025-07-11 12:47:13.21885+02	2025-07-11 12:57:00.537437+02	Mandara	mandara	t	3	\N
10	2025-07-11 12:47:13.239979+02	2025-07-11 12:57:00.556215+02	Manresa	manresa	t	3	\N
11	2025-07-11 12:47:13.267149+02	2025-07-11 12:57:00.574853+02	Msasa	msasa	t	3	\N
12	2025-07-11 12:47:13.287804+02	2025-07-11 12:57:00.592981+02	Rhodesville	rhodesville	t	3	\N
13	2025-07-11 12:47:13.311674+02	2025-07-11 12:57:00.607109+02	Rockview	rockview	t	3	\N
14	2025-07-11 12:47:13.33981+02	2025-07-11 12:57:00.626506+02	Sunway City	sunway-city	t	3	\N
15	2025-07-11 12:47:13.362599+02	2025-07-11 12:57:00.644476+02	Zimre Park	zimre-park	t	3	\N
16	2025-07-11 12:47:13.392603+02	2025-07-11 12:57:00.66354+02	Upper Hillside	upper-hillside	t	3	\N
17	2025-07-11 12:47:13.428294+02	2025-07-11 12:57:00.678206+02	Kamfinsa	kamfinsa	t	3	\N
18	2025-07-11 12:47:13.453101+02	2025-07-11 12:57:00.696195+02	Eastview	eastview	t	3	\N
19	2025-07-11 12:47:13.476175+02	2025-07-11 12:57:00.714982+02	Budiriro	budiriro	t	3	\N
20	2025-07-11 12:47:13.503701+02	2025-07-11 12:57:00.731817+02	Glen Norah	glen-norah	t	3	\N
21	2025-07-11 12:47:13.52639+02	2025-07-11 12:57:00.746463+02	Glen View	glen-view	t	3	\N
22	2025-07-11 12:47:13.55248+02	2025-07-11 12:57:00.763946+02	Dzivarasekwa	dzivarasekwa	t	3	\N
23	2025-07-11 12:47:13.593709+02	2025-07-11 12:57:00.778496+02	Epworth	epworth	t	3	\N
24	2025-07-11 12:47:13.626213+02	2025-07-11 12:57:00.79575+02	Highfield	highfield	t	3	\N
25	2025-07-11 12:47:13.648596+02	2025-07-11 12:57:00.810688+02	Hatcliffe	hatcliffe	t	3	\N
26	2025-07-11 12:47:13.670912+02	2025-07-11 12:57:00.824134+02	Kambuzuma	kambuzuma	t	3	\N
27	2025-07-11 12:47:13.694544+02	2025-07-11 12:57:00.84064+02	Kuwadzana	kuwadzana	t	3	\N
28	2025-07-11 12:47:13.71763+02	2025-07-11 12:57:00.856976+02	Mabvuku	mabvuku	t	3	\N
29	2025-07-11 12:47:13.746927+02	2025-07-11 12:57:00.871239+02	Mbare	mbare	t	3	\N
30	2025-07-11 12:47:13.774293+02	2025-07-11 12:57:00.886047+02	Marimba Park	marimba-park	t	3	\N
31	2025-07-11 12:47:13.797668+02	2025-07-11 12:57:00.905638+02	Mufakose	mufakose	t	3	\N
32	2025-07-11 12:47:13.825294+02	2025-07-11 12:57:00.925038+02	Rydale Ridge	rydale-ridge	t	3	\N
33	2025-07-11 12:47:13.853658+02	2025-07-11 12:57:00.948294+02	Sunningdale	sunningdale	t	3	\N
34	2025-07-11 12:47:13.877236+02	2025-07-11 12:57:00.981471+02	Snake Park	snake-park	t	3	\N
35	2025-07-11 12:47:13.895722+02	2025-07-11 12:57:01.000273+02	Tafara	tafara	t	3	\N
36	2025-07-11 12:47:13.918173+02	2025-07-11 12:57:01.018857+02	Warren Park	warren-park	t	3	\N
37	2025-07-11 12:47:13.937736+02	2025-07-11 12:57:01.042932+02	Crowborough	crowborough	t	3	\N
38	2025-07-11 12:47:13.970595+02	2025-07-11 12:57:01.060133+02	Adelaide Park	adelaide-park	t	3	\N
39	2025-07-11 12:47:13.988578+02	2025-07-11 12:57:01.077315+02	Rugare	rugare	t	3	\N
40	2025-07-11 12:47:14.016153+02	2025-07-11 12:57:01.094263+02	Granary Park	granary-park	t	3	\N
41	2025-07-11 12:47:14.048838+02	2025-07-11 12:57:01.110888+02	Highlands	highlands	t	3	\N
42	2025-07-11 12:47:14.071992+02	2025-07-11 12:57:01.131219+02	Chisipite	chisipite	t	3	\N
43	2025-07-11 12:47:14.09897+02	2025-07-11 12:57:01.14242+02	Avondale	avondale	t	3	\N
44	2025-07-11 12:47:14.123785+02	2025-07-11 12:57:01.157491+02	Alexandra Park	alexandra-park	t	3	\N
45	2025-07-11 12:47:14.149743+02	2025-07-11 12:57:01.172002+02	Ballantyne Park	ballantyne-park	t	3	\N
46	2025-07-11 12:47:14.170619+02	2025-07-11 12:57:01.186399+02	Belgravia	belgravia	t	3	\N
47	2025-07-11 12:47:14.201473+02	2025-07-11 12:57:01.205421+02	Borrowdale West	borrowdale-west	t	3	\N
48	2025-07-11 12:47:14.228464+02	2025-07-11 12:57:01.218445+02	Borrowdale Brooke	borrowdale-brooke	t	3	\N
49	2025-07-11 12:47:14.248067+02	2025-07-11 12:57:01.235843+02	Charlotte Brooke	charlotte-brooke	t	3	\N
50	2025-07-11 12:47:14.271934+02	2025-07-11 12:57:01.256974+02	Colray	colray	t	3	\N
51	2025-07-11 12:47:14.294335+02	2025-07-11 12:57:01.270447+02	Colne Valley	colne-valley	t	3	\N
52	2025-07-11 12:47:14.314412+02	2025-07-11 12:57:01.284094+02	Dandaro	dandaro	t	3	\N
53	2025-07-11 12:47:14.335548+02	2025-07-11 12:57:01.30168+02	Crowhill Views	crowhill-views	t	3	\N
54	2025-07-11 12:47:14.353073+02	2025-07-11 12:57:01.317538+02	Groom Bridge	groom-bridge	t	3	\N
55	2025-07-11 12:47:14.381622+02	2025-07-11 12:57:01.331721+02	Gunhill	gunhill	t	3	\N
56	2025-07-11 12:47:14.412154+02	2025-07-11 12:57:01.346896+02	Glen Lorne	glen-lorne	t	3	\N
57	2025-07-11 12:47:14.436186+02	2025-07-11 12:57:01.360442+02	Glen Forest	glen-forest	t	3	\N
58	2025-07-11 12:47:14.457807+02	2025-07-11 12:57:01.377116+02	Gletwin Park	gletwin-park	t	3	\N
59	2025-07-11 12:47:14.484673+02	2025-07-11 12:57:01.390269+02	Greystone Park	greystone-park	t	3	\N
60	2025-07-11 12:47:14.508167+02	2025-07-11 12:57:01.402319+02	Helensvale	helensvale	t	3	\N
61	2025-07-11 12:47:14.536137+02	2025-07-11 12:57:01.422505+02	Hogerty Hill	hogerty-hill	t	3	\N
62	2025-07-11 12:47:14.558991+02	2025-07-11 12:57:01.437626+02	Kambanji	kambanji	t	3	\N
63	2025-07-11 12:47:14.580023+02	2025-07-11 12:57:01.453413+02	Lewisam	lewisam	t	3	\N
64	2025-07-11 12:47:14.604131+02	2025-07-11 12:57:01.468957+02	Mount Pleasant	mount-pleasant	t	3	\N
65	2025-07-11 12:47:14.626782+02	2025-07-11 12:57:01.487117+02	Newlands	newlands	t	3	\N
66	2025-07-11 12:47:14.655167+02	2025-07-11 12:57:01.502912+02	Northwood	northwood	t	3	\N
67	2025-07-11 12:47:14.676925+02	2025-07-11 12:57:01.519584+02	Philadelphia	philadelphia	t	3	\N
68	2025-07-11 12:47:14.713338+02	2025-07-11 12:57:01.529393+02	Pomona	pomona	t	3	\N
69	2025-07-11 12:47:14.738603+02	2025-07-11 12:57:01.546452+02	Quinnington	quinnington	t	3	\N
70	2025-07-11 12:47:14.75801+02	2025-07-11 12:57:01.563119+02	Rolf Valley	rolf-valley	t	3	\N
71	2025-07-11 12:47:14.791184+02	2025-07-11 12:57:01.573684+02	Ryelands	ryelands	t	3	\N
72	2025-07-11 12:47:14.823747+02	2025-07-11 12:57:01.587255+02	Shawasha Hills	shawasha-hills	t	3	\N
73	2025-07-11 12:47:14.842968+02	2025-07-11 12:57:01.608985+02	Sally Mugabe Heights	sally-mugabe-heights	t	3	\N
74	2025-07-11 12:47:14.868999+02	2025-07-11 12:57:01.629761+02	The Grange	the-grange	t	3	\N
75	2025-07-11 12:47:14.891005+02	2025-07-11 12:57:01.646394+02	Umwinsidale	umwinsidale	t	3	\N
76	2025-07-11 12:47:14.911183+02	2025-07-11 12:57:01.660948+02	Vainona	vainona	t	3	\N
77	2025-07-11 12:47:14.941183+02	2025-07-11 12:57:01.682895+02	Greendale North	greendale-north	t	3	\N
78	2025-07-11 12:47:14.965412+02	2025-07-11 12:57:01.701455+02	Mt Pleasant Heights	mt-pleasant-heights	t	3	\N
79	2025-07-11 12:47:14.992199+02	2025-07-11 12:57:01.715211+02	Teviotdale	teviotdale	t	3	\N
80	2025-07-11 12:47:15.016855+02	2025-07-11 12:57:01.724841+02	Carrick Creagh Estate	carrick-creagh-estate	t	3	\N
81	2025-07-11 12:47:15.050225+02	2025-07-11 12:57:01.740504+02	Glenwood	glenwood	t	3	\N
82	2025-07-11 12:47:15.076158+02	2025-07-11 12:57:01.757896+02	Borrowdale	borrowdale	t	3	\N
83	2025-07-11 12:47:15.108507+02	2025-07-11 12:57:01.771743+02	Airport	airport	t	3	\N
84	2025-07-11 12:47:15.135112+02	2025-07-11 12:57:01.784081+02	Arcadia	arcadia	t	3	\N
85	2025-07-11 12:47:15.157646+02	2025-07-11 12:57:01.799462+02	Ardbennie	ardbennie	t	3	\N
86	2025-07-11 12:47:15.183581+02	2025-07-11 12:57:01.814306+02	Braeside	braeside	t	3	\N
87	2025-07-11 12:47:15.220527+02	2025-07-11 12:57:01.830035+02	Chadcombe	chadcombe	t	3	\N
88	2025-07-11 12:47:15.242001+02	2025-07-11 12:57:01.846873+02	Cranborne	cranborne	t	3	\N
89	2025-07-11 12:47:15.267466+02	2025-07-11 12:57:01.85764+02	Graniteside	graniteside	t	3	\N
90	2025-07-11 12:47:15.290765+02	2025-07-11 12:57:01.871952+02	Hatfield	hatfield	t	3	\N
91	2025-07-11 12:47:15.314471+02	2025-07-11 12:57:01.890671+02	Hillside	hillside	t	3	\N
92	2025-07-11 12:47:15.337926+02	2025-07-11 12:57:01.903585+02	Houghton Park	houghton-park	t	3	\N
93	2025-07-11 12:47:15.361073+02	2025-07-11 12:57:01.917388+02	Logan Park	logan-park	t	3	\N
96	2025-07-11 12:47:15.434921+02	2025-07-11 12:57:01.966548+02	Parktown	parktown	t	3	\N
97	2025-07-11 12:47:15.460526+02	2025-07-11 12:57:01.981194+02	Park Meadowlands	park-meadowlands	t	3	\N
98	2025-07-11 12:47:15.482359+02	2025-07-11 12:57:02.004205+02	Prospect	prospect	t	3	\N
99	2025-07-11 12:47:15.512704+02	2025-07-11 12:57:02.023219+02	Queensdale	queensdale	t	3	\N
100	2025-07-11 12:47:15.539135+02	2025-07-11 12:57:02.040187+02	Southerton	southerton	t	3	\N
101	2025-07-11 12:47:15.55894+02	2025-07-11 12:57:02.052881+02	St. Martins	st-martins	t	3	\N
102	2025-07-11 12:47:15.595784+02	2025-07-11 12:57:02.070051+02	Waterfalls	waterfalls	t	3	\N
103	2025-07-11 12:47:15.618938+02	2025-07-11 12:57:02.086591+02	Willowvale	willowvale	t	3	\N
104	2025-07-11 12:47:15.644635+02	2025-07-11 12:57:02.106176+02	Workington	workington	t	3	\N
105	2025-07-11 12:47:15.683628+02	2025-07-11 12:57:02.124056+02	Southlea Park	southlea-park	t	3	\N
106	2025-07-11 12:47:15.731547+02	2025-07-11 12:57:02.138756+02	Arlington	arlington	t	3	\N
107	2025-07-11 12:47:15.77477+02	2025-07-11 12:57:02.154592+02	Exelsior	exelsior	t	3	\N
108	2025-07-11 12:47:15.820655+02	2025-07-11 12:57:02.177365+02	Southview Park	southview-park	t	3	\N
109	2025-07-11 12:47:15.869251+02	2025-07-11 12:57:02.192866+02	Stoneridge	stoneridge	t	3	\N
110	2025-07-11 12:47:15.906376+02	2025-07-11 12:57:02.214634+02	Lochinvar	lochinvar	t	3	\N
111	2025-07-11 12:47:15.940123+02	2025-07-11 12:57:02.236824+02	Retreat	retreat	t	3	\N
112	2025-07-11 12:47:15.964385+02	2025-07-11 12:57:02.252247+02	Ushewokunze	ushewokunze	t	3	\N
113	2025-07-11 12:47:15.9902+02	2025-07-11 12:57:02.266237+02	Graylands Park	graylands-park	t	3	\N
114	2025-07-11 12:47:16.024265+02	2025-07-11 12:57:02.279192+02	Adylinn	adylinn	t	3	\N
115	2025-07-11 12:47:16.051479+02	2025-07-11 12:57:02.295378+02	Ashbrittle	ashbrittle	t	3	\N
116	2025-07-11 12:47:16.107124+02	2025-07-11 12:57:02.307511+02	Ashdown Park	ashdown-park	t	3	\N
117	2025-07-11 12:47:16.149108+02	2025-07-11 12:57:02.322368+02	Avondale - The Ridge	avondale-the-ridge	t	3	\N
118	2025-07-11 12:47:16.186662+02	2025-07-11 12:57:02.341947+02	Avondale West	avondale-west	t	3	\N
119	2025-07-11 12:47:16.289199+02	2025-07-11 12:57:02.357521+02	Avonlea	avonlea	t	3	\N
120	2025-07-11 12:47:16.322168+02	2025-07-11 12:57:02.370118+02	Belvedere	belvedere	t	3	\N
122	2025-07-11 12:47:16.380401+02	2025-07-11 12:57:02.394034+02	Cold Comfort	cold-comfort	t	3	\N
123	2025-07-11 12:47:16.410141+02	2025-07-11 12:57:02.410206+02	Cotswold Hills	cotswold-hills	t	3	\N
124	2025-07-11 12:47:16.451036+02	2025-07-11 12:57:02.429515+02	Dawnview Park	dawnview-park	t	3	\N
125	2025-07-11 12:47:16.487175+02	2025-07-11 12:57:02.447169+02	Emerald Hill	emerald-hill	t	3	\N
126	2025-07-11 12:47:16.537289+02	2025-07-11 12:57:02.461026+02	Greencroft	greencroft	t	3	\N
127	2025-07-11 12:47:16.578168+02	2025-07-11 12:57:02.479749+02	Haig Park	haig-park	t	3	\N
128	2025-07-11 12:47:16.615989+02	2025-07-11 12:57:02.496165+02	Kensington	kensington	t	3	\N
129	2025-07-11 12:47:16.648166+02	2025-07-11 12:57:02.51266+02	Marlborough	marlborough	t	3	\N
130	2025-07-11 12:47:16.682129+02	2025-07-11 12:57:02.530038+02	Mabelreign	mabelreign	t	3	\N
131	2025-07-11 12:47:16.720819+02	2025-07-11 12:57:02.541214+02	Matidoda	matidoda	t	3	\N
132	2025-07-11 12:47:16.755936+02	2025-07-11 12:57:02.559813+02	Meyrick Park	meyrick-park	t	3	\N
133	2025-07-11 12:47:16.788239+02	2025-07-11 12:57:02.57513+02	Milton Park	milton-park	t	3	\N
134	2025-07-11 12:47:16.820068+02	2025-07-11 12:57:02.592673+02	Monavale	monavale	t	3	\N
135	2025-07-11 12:47:16.851337+02	2025-07-11 12:57:02.610885+02	Nkwisi Gardens	nkwisi-gardens	t	3	\N
136	2025-07-11 12:47:16.888799+02	2025-07-11 12:57:02.624073+02	Mt Hampden	mt-hampden	t	3	\N
137	2025-07-11 12:47:16.917987+02	2025-07-11 12:57:02.648368+02	Ridgeview	ridgeview	t	3	\N
138	2025-07-11 12:47:16.947369+02	2025-07-11 12:57:02.661016+02	Rydale Ridge Park	rydale-ridge-park	t	3	\N
139	2025-07-11 12:47:16.987064+02	2025-07-11 12:57:02.679158+02	Sentosa	sentosa	t	3	\N
140	2025-07-11 12:47:17.024126+02	2025-07-11 12:57:02.697802+02	Spitzkop	spitzkop	t	3	\N
141	2025-07-11 12:47:17.055523+02	2025-07-11 12:57:02.714709+02	Strathaven	strathaven	t	3	\N
142	2025-07-11 12:47:17.095189+02	2025-07-11 12:57:02.732072+02	Sunridge	sunridge	t	3	\N
143	2025-07-11 12:47:17.123599+02	2025-07-11 12:57:02.750074+02	Tynwald	tynwald	t	3	\N
144	2025-07-11 12:47:17.155013+02	2025-07-11 12:57:02.780065+02	Warren Hills	warren-hills	t	3	\N
145	2025-07-11 12:47:17.188147+02	2025-07-11 12:57:02.800773+02	Westgate	westgate	t	3	\N
146	2025-07-11 12:47:17.221834+02	2025-07-11 12:57:02.837282+02	Westlea Hre	westlea-hre	t	3	\N
147	2025-07-11 12:47:17.248988+02	2025-07-11 12:57:02.873379+02	Whitecliff	whitecliff	t	3	\N
148	2025-07-11 12:47:17.2787+02	2025-07-11 12:57:02.931649+02	Glaudina	glaudina	t	3	\N
149	2025-07-11 12:47:17.314202+02	2025-07-11 12:57:02.962705+02	Rainham	rainham	t	3	\N
150	2025-07-11 12:47:17.356326+02	2025-07-11 12:57:02.984044+02	Bloomingdale	bloomingdale	t	3	\N
151	2025-07-11 12:47:17.382882+02	2025-07-11 12:57:02.9989+02	Madokero Estates	madokero-estates	t	3	\N
152	2025-07-11 12:47:17.414233+02	2025-07-11 12:57:03.029705+02	Sandton Park	sandton-park	t	3	\N
153	2025-07-11 12:47:17.442352+02	2025-07-11 12:57:03.053236+02	Aspindale Park	aspindale-park	t	3	\N
154	2025-07-11 12:47:17.469153+02	2025-07-11 12:57:03.076736+02	Fairview	fairview	t	3	\N
155	2025-07-11 12:47:17.506071+02	2025-07-11 12:57:03.099055+02	Goodhope	goodhope	t	3	\N
156	2025-07-11 12:47:17.548865+02	2025-07-11 12:57:03.121143+02	Falcon Park	falcon-park	t	3	\N
157	2025-07-11 12:47:17.576165+02	2025-07-11 12:57:03.145146+02	Bulawayo City Centre	bulawayo-city-centre	t	4	\N
158	2025-07-11 12:47:17.601418+02	2025-07-11 12:57:03.172815+02	Westondale	westondale	t	4	\N
159	2025-07-11 12:47:17.630373+02	2025-07-11 12:57:03.207129+02	Steeldale	steeldale	t	4	\N
160	2025-07-11 12:47:17.652704+02	2025-07-11 12:57:03.241193+02	Westgate Byo	westgate-byo	t	4	\N
161	2025-07-11 12:47:17.681283+02	2025-07-11 12:57:03.264099+02	Belmont	belmont	t	4	\N
162	2025-07-11 12:47:17.709361+02	2025-07-11 12:57:03.283215+02	Donnington	donnington	t	4	\N
163	2025-07-11 12:47:17.744011+02	2025-07-11 12:57:03.298954+02	Donnington West	donnington-west	t	4	\N
164	2025-07-11 12:47:17.773038+02	2025-07-11 12:57:03.313363+02	Thorngrove	thorngrove	t	4	\N
165	2025-07-11 12:47:17.816707+02	2025-07-11 12:57:03.330028+02	Kelvin	kelvin	t	4	\N
166	2025-07-11 12:47:17.881222+02	2025-07-11 12:57:03.347002+02	Kelvin West	kelvin-west	t	4	\N
167	2025-07-11 12:47:17.944182+02	2025-07-11 12:57:03.366071+02	Spezini	spezini	t	4	\N
168	2025-07-11 12:47:17.972702+02	2025-07-11 12:57:03.381385+02	Fortunes Gate	fortunes-gate	t	4	\N
169	2025-07-11 12:47:18.005364+02	2025-07-11 12:57:03.398646+02	Riverside South	riverside-south	t	4	\N
170	2025-07-11 12:47:18.058321+02	2025-07-11 12:57:03.41272+02	Willsgrove	willsgrove	t	4	\N
171	2025-07-11 12:47:18.101051+02	2025-07-11 12:57:03.427995+02	Manningdale	manningdale	t	4	\N
172	2025-07-11 12:47:18.132092+02	2025-07-11 12:57:03.442831+02	Waterford	waterford	t	4	\N
173	2025-07-11 12:47:18.170083+02	2025-07-11 12:57:03.461647+02	Douglasdale	douglasdale	t	4	\N
174	2025-07-11 12:47:18.206459+02	2025-07-11 12:57:03.472955+02	Riverside North	riverside-north	t	4	\N
175	2025-07-11 12:47:18.234435+02	2025-07-11 12:57:03.487288+02	Sunning Hill	sunning-hill	t	4	\N
176	2025-07-11 12:47:18.266431+02	2025-07-11 12:57:03.503002+02	Matsheumhlope	matsheumhlope	t	4	\N
177	2025-07-11 12:47:18.295693+02	2025-07-11 12:57:03.518422+02	Selbourne Park	selbourne-park	t	4	\N
178	2025-07-11 12:47:18.328831+02	2025-07-11 12:57:03.536712+02	Woodlands	woodlands	t	4	\N
179	2025-07-11 12:47:18.361694+02	2025-07-11 12:57:03.551076+02	Kumalo	kumalo	t	4	\N
180	2025-07-11 12:47:18.406451+02	2025-07-11 12:57:03.567493+02	Parklands	parklands	t	4	\N
181	2025-07-11 12:47:18.441205+02	2025-07-11 12:57:03.583421+02	Killarney	killarney	t	4	\N
182	2025-07-11 12:47:18.473901+02	2025-07-11 12:57:03.599182+02	Hume Park	hume-park	t	4	\N
185	2025-07-11 12:47:18.566096+02	2025-07-11 12:57:03.649291+02	Gumtree	gumtree	t	4	\N
187	2025-07-11 12:47:18.643262+02	2025-07-11 12:57:03.687609+02	Lakeside	lakeside	t	4	\N
188	2025-07-11 12:47:18.681256+02	2025-07-11 12:57:03.70507+02	Ascot	ascot	t	4	\N
189	2025-07-11 12:47:18.71304+02	2025-07-11 12:57:03.724967+02	Worringham	worringham	t	4	\N
190	2025-07-11 12:47:18.757257+02	2025-07-11 12:57:03.745975+02	Suburbs	suburbs	t	4	\N
191	2025-07-11 12:47:18.792036+02	2025-07-11 12:57:03.771435+02	Lochview	lochview	t	4	\N
192	2025-07-11 12:47:18.820133+02	2025-07-11 12:57:03.810847+02	Home Fountain	home-fountain	t	4	\N
193	2025-07-11 12:47:18.85081+02	2025-07-11 12:57:03.844089+02	Barbour Fields	barbour-fields	t	4	\N
194	2025-07-11 12:47:18.885481+02	2025-07-11 12:57:03.860259+02	Mzilikazi	mzilikazi	t	4	\N
195	2025-07-11 12:47:18.927154+02	2025-07-11 12:57:03.882826+02	Makokoba	makokoba	t	4	\N
196	2025-07-11 12:47:18.970117+02	2025-07-11 12:57:03.901011+02	Matshombana	matshombana	t	4	\N
197	2025-07-11 12:47:19.022507+02	2025-07-11 12:57:03.919041+02	Nguboyenja	nguboyenja	t	4	\N
198	2025-07-11 12:47:19.079876+02	2025-07-11 12:57:03.939175+02	West Somerton	west-somerton	t	4	\N
199	2025-07-11 12:47:19.128102+02	2025-07-11 12:57:03.958503+02	Emganwini	emganwini	t	4	\N
200	2025-07-11 12:47:19.169429+02	2025-07-11 12:57:03.979965+02	Umganin	umganin	t	4	\N
201	2025-07-11 12:47:19.223216+02	2025-07-11 12:57:03.996027+02	Bubi Umguza	bubi-umguza	t	4	\N
202	2025-07-11 12:47:19.26699+02	2025-07-11 12:57:04.019104+02	Upper Rangemore	upper-rangemore	t	4	\N
203	2025-07-11 12:47:19.333464+02	2025-07-11 12:57:04.038614+02	Nkulumane	nkulumane	t	4	\N
204	2025-07-11 12:47:19.373166+02	2025-07-11 12:57:04.063088+02	Nketa	nketa	t	4	\N
205	2025-07-11 12:47:19.424303+02	2025-07-11 12:57:04.086502+02	Tshabalala	tshabalala	t	4	\N
206	2025-07-11 12:47:19.487442+02	2025-07-11 12:57:04.105522+02	Tshabalala Extension	tshabalala-extension	t	4	\N
207	2025-07-11 12:47:19.540757+02	2025-07-11 12:57:04.121471+02	Sizinda	sizinda	t	4	\N
208	2025-07-11 12:47:19.592215+02	2025-07-11 12:57:04.143101+02	Cowdray Park	cowdray-park	t	4	\N
209	2025-07-11 12:47:19.64241+02	2025-07-11 12:57:04.16491+02	Enqotsheni	enqotsheni	t	4	\N
210	2025-07-11 12:47:19.73166+02	2025-07-11 12:57:04.193591+02	New Luveve	new-luveve	t	4	\N
211	2025-07-11 12:47:19.795176+02	2025-07-11 12:57:04.213888+02	Luveve North	luveve-north	t	4	\N
212	2025-07-11 12:47:19.82843+02	2025-07-11 12:57:04.225074+02	Luveve	luveve	t	4	\N
213	2025-07-11 12:47:19.862192+02	2025-07-11 12:57:04.23645+02	Emakhandeni	emakhandeni	t	4	\N
214	2025-07-11 12:47:19.90161+02	2025-07-11 12:57:04.254259+02	Pelandaba	pelandaba	t	4	\N
215	2025-07-11 12:47:19.942792+02	2025-07-11 12:57:04.26844+02	Lobengula	lobengula	t	4	\N
216	2025-07-11 12:47:19.983143+02	2025-07-11 12:57:04.280843+02	Magwegwe	magwegwe	t	4	\N
217	2025-07-11 12:47:20.042885+02	2025-07-11 12:57:04.292735+02	Mpopoma	mpopoma	t	4	\N
218	2025-07-11 12:47:20.098131+02	2025-07-11 12:57:04.309944+02	Mpopoma South	mpopoma-south	t	4	\N
219	2025-07-11 12:47:20.139155+02	2025-07-11 12:57:04.325187+02	Pumula	pumula	t	4	\N
220	2025-07-11 12:47:20.194093+02	2025-07-11 12:57:04.338713+02	Pumula South	pumula-south	t	4	\N
221	2025-07-11 12:47:20.263149+02	2025-07-11 12:57:04.35312+02	Paddonhurst	paddonhurst	t	4	\N
222	2025-07-11 12:47:20.336925+02	2025-07-11 12:57:04.368633+02	Sunnyside	sunnyside	t	4	\N
223	2025-07-11 12:47:20.405595+02	2025-07-11 12:57:04.383652+02	Tegela	tegela	t	4	\N
224	2025-07-11 12:47:20.47418+02	2025-07-11 12:57:04.399212+02	Romney Park	romney-park	t	4	\N
225	2025-07-11 12:47:20.530497+02	2025-07-11 12:57:04.41188+02	Queens Park East	queens-park-east	t	4	\N
226	2025-07-11 12:47:20.583693+02	2025-07-11 12:57:04.425928+02	Queens Park West	queens-park-west	t	4	\N
227	2025-07-11 12:47:20.617949+02	2025-07-11 12:57:04.447515+02	Northgate	northgate	t	4	\N
228	2025-07-11 12:47:20.645669+02	2025-07-11 12:57:04.464046+02	Orange Grove	orange-grove	t	4	\N
229	2025-07-11 12:47:20.671327+02	2025-07-11 12:57:04.475103+02	Woodville Park	woodville-park	t	4	\N
230	2025-07-11 12:47:20.703468+02	2025-07-11 12:57:04.497507+02	Jacaranda	jacaranda	t	4	\N
231	2025-07-11 12:47:20.738138+02	2025-07-11 12:57:04.508257+02	Northlea Byo	northlea-byo	t	4	\N
232	2025-07-11 12:47:20.769145+02	2025-07-11 12:57:04.524007+02	Woodville	woodville	t	4	\N
233	2025-07-11 12:47:20.799127+02	2025-07-11 12:57:04.541143+02	Kingsdale	kingsdale	t	4	\N
234	2025-07-11 12:47:20.8293+02	2025-07-11 12:57:04.561471+02	Queensdale Byo	queensdale-byo	t	4	\N
235	2025-07-11 12:47:20.860731+02	2025-07-11 12:57:04.578361+02	Lobenvale	lobenvale	t	4	\N
236	2025-07-11 12:47:20.896246+02	2025-07-11 12:57:04.6019+02	The Jungle	the-jungle	t	4	\N
237	2025-07-11 12:47:20.933784+02	2025-07-11 12:57:04.620001+02	Umguza Byo	umguza-byo	t	4	\N
238	2025-07-11 12:47:20.968134+02	2025-07-11 12:57:04.638034+02	North Trenance	north-trenance	t	4	\N
239	2025-07-11 12:47:21.000275+02	2025-07-11 12:57:04.665066+02	Richmond	richmond	t	4	\N
240	2025-07-11 12:47:21.039696+02	2025-07-11 12:57:04.684677+02	Upper Glenville	upper-glenville	t	4	\N
241	2025-07-11 12:47:21.075817+02	2025-07-11 12:57:04.699866+02	Glenville	glenville	t	4	\N
242	2025-07-11 12:47:21.110515+02	2025-07-11 12:57:04.715704+02	Windsor Park Byo	windsor-park-byo	t	4	\N
243	2025-07-11 12:47:21.14542+02	2025-07-11 12:57:04.737443+02	Trenance	trenance	t	4	\N
244	2025-07-11 12:47:21.180184+02	2025-07-11 12:57:04.752539+02	Entumbane	entumbane	t	4	\N
245	2025-07-11 12:47:21.211166+02	2025-07-11 12:57:04.765846+02	Glengarry	glengarry	t	4	\N
246	2025-07-11 12:47:21.252112+02	2025-07-11 12:57:04.781843+02	Northend	northend	t	4	\N
247	2025-07-11 12:47:21.287239+02	2025-07-11 12:57:04.800504+02	Mahatshula	mahatshula	t	4	\N
248	2025-07-11 12:47:21.320079+02	2025-07-11 12:57:04.817022+02	Rangemore	rangemore	t	4	\N
249	2025-07-11 12:47:21.354975+02	2025-07-11 12:57:04.83343+02	Sauerstown	sauerstown	t	4	\N
250	2025-07-11 12:47:21.40014+02	2025-07-11 12:57:04.848978+02	Highmount	highmount	t	4	\N
251	2025-07-11 12:47:21.499146+02	2025-07-11 12:57:04.862047+02	Arundel	arundel	t	4	\N
252	2025-07-11 12:47:21.56034+02	2025-07-11 12:57:04.871997+02	North End	north-end	t	4	\N
253	2025-07-11 12:47:21.591805+02	2025-07-11 12:57:04.885661+02	Hopeville	hopeville	t	4	\N
254	2025-07-11 12:47:21.620803+02	2025-07-11 12:57:04.897746+02	Hillside Byo	hillside-byo	t	4	\N
255	2025-07-11 12:47:21.648993+02	2025-07-11 12:57:04.91857+02	Greenhill	greenhill	t	4	\N
256	2025-07-11 12:47:21.682266+02	2025-07-11 12:57:04.936513+02	Southwold	southwold	t	4	\N
257	2025-07-11 12:47:21.709588+02	2025-07-11 12:57:04.953302+02	Barham Green	barham-green	t	4	\N
258	2025-07-11 12:47:21.738152+02	2025-07-11 12:57:04.962747+02	Morningside Byo	morningside-byo	t	4	\N
259	2025-07-11 12:47:21.766255+02	2025-07-11 12:57:04.980109+02	Hillcrest	hillcrest	t	4	\N
260	2025-07-11 12:47:21.790092+02	2025-07-11 12:57:04.995116+02	Montrose Byo	montrose-byo	t	4	\N
261	2025-07-11 12:47:21.820044+02	2025-07-11 12:57:05.009519+02	Bellevue	bellevue	t	4	\N
262	2025-07-11 12:47:21.84706+02	2025-07-11 12:57:05.021829+02	Newton	newton	t	4	\N
263	2025-07-11 12:47:21.881039+02	2025-07-11 12:57:05.040142+02	Newton West	newton-west	t	4	\N
264	2025-07-11 12:47:21.92178+02	2025-07-11 12:57:05.057053+02	Four Winds	four-winds	t	4	\N
265	2025-07-11 12:47:21.953037+02	2025-07-11 12:57:05.076819+02	Eloana	eloana	t	4	\N
266	2025-07-11 12:47:22.000292+02	2025-07-11 12:57:05.091976+02	South Riding	south-riding	t	4	\N
267	2025-07-11 12:47:22.05471+02	2025-07-11 12:57:05.114079+02	Malindela	malindela	t	4	\N
268	2025-07-11 12:47:22.139193+02	2025-07-11 12:57:05.129913+02	Munda	munda	t	4	\N
269	2025-07-11 12:47:22.172099+02	2025-07-11 12:57:05.140766+02	Intini	intini	t	4	\N
270	2025-07-11 12:47:22.215123+02	2025-07-11 12:57:05.152735+02	Southdale	southdale	t	4	\N
271	2025-07-11 12:47:22.247565+02	2025-07-11 12:57:05.164595+02	Bradfield	bradfield	t	4	\N
272	2025-07-11 12:47:22.27321+02	2025-07-11 12:57:05.1848+02	Belmont East	belmont-east	t	4	\N
273	2025-07-11 12:47:22.320096+02	2025-07-11 12:57:05.199675+02	Famona	famona	t	4	\N
274	2025-07-11 12:47:22.380526+02	2025-07-11 12:57:05.214744+02	Buhera	buhera	t	5	\N
275	2025-07-11 12:47:22.437613+02	2025-07-11 12:57:05.247372+02	Chimanimani	chimanimani	t	6	\N
276	2025-07-11 12:47:22.518965+02	2025-07-11 12:57:05.260597+02	Chipinge	chipinge	t	7	\N
277	2025-07-11 12:47:22.54448+02	2025-07-11 12:57:05.271491+02	Headlands	headlands	t	8	\N
278	2025-07-11 12:47:22.566535+02	2025-07-11 12:57:05.286951+02	Juliasdale	juliasdale	t	9	\N
281	2025-07-11 12:47:22.661677+02	2025-07-11 12:57:05.333037+02	Chikanga	chikanga	t	12	\N
282	2025-07-11 12:47:22.699314+02	2025-07-11 12:57:05.347636+02	Mutare CBD	mutare-cbd	t	12	\N
283	2025-07-11 12:47:22.7312+02	2025-07-11 12:57:05.363043+02	Fairbridge Park	fairbridge-park	t	12	\N
284	2025-07-11 12:47:22.766907+02	2025-07-11 12:57:05.377882+02	Murambi	murambi	t	12	\N
285	2025-07-11 12:47:22.793771+02	2025-07-11 12:57:05.394433+02	Morningside	morningside	t	12	\N
286	2025-07-11 12:47:22.817863+02	2025-07-11 12:57:05.410457+02	Tiger's Kloof	tigers-kloof	t	12	\N
287	2025-07-11 12:47:22.845404+02	2025-07-11 12:57:05.425691+02	Palmerston	palmerston	t	12	\N
290	2025-07-11 12:47:22.909031+02	2025-07-11 12:57:05.466013+02	Darlington	darlington	t	12	\N
291	2025-07-11 12:47:22.931939+02	2025-07-11 12:57:05.481758+02	Greenside	greenside	t	12	\N
292	2025-07-11 12:47:22.955531+02	2025-07-11 12:57:05.497275+02	Yeovil	yeovil	t	12	\N
293	2025-07-11 12:47:22.974433+02	2025-07-11 12:57:05.507976+02	Westlea	westlea	t	12	\N
294	2025-07-11 12:47:22.990002+02	2025-07-11 12:57:05.520038+02	Florida	florida	t	12	\N
295	2025-07-11 12:47:23.016852+02	2025-07-11 12:57:05.536718+02	Toronto	toronto	t	12	\N
296	2025-07-11 12:47:23.045675+02	2025-07-11 12:57:05.554737+02	Sakubva	sakubva	t	12	\N
297	2025-07-11 12:47:23.069304+02	2025-07-11 12:57:05.571438+02	Dangamvura	dangamvura	t	12	\N
298	2025-07-11 12:47:23.104018+02	2025-07-11 12:57:05.58415+02	Weirmouth	weirmouth	t	12	\N
299	2025-07-11 12:47:23.139824+02	2025-07-11 12:57:05.605186+02	Fern Valley	fern-valley	t	12	\N
300	2025-07-11 12:47:23.185338+02	2025-07-11 12:57:05.623071+02	Zimunya	zimunya	t	12	\N
301	2025-07-11 12:47:23.210062+02	2025-07-11 12:57:05.640768+02	Bordervale	bordervale	t	12	\N
302	2025-07-11 12:47:23.227893+02	2025-07-11 12:57:05.656483+02	Muchena	muchena	t	12	\N
303	2025-07-11 12:47:23.254746+02	2025-07-11 12:57:05.671295+02	Chisamba	chisamba	t	12	\N
304	2025-07-11 12:47:23.276307+02	2025-07-11 12:57:05.690232+02	Mazhambe	mazhambe	t	12	\N
305	2025-07-11 12:47:23.302111+02	2025-07-11 12:57:05.707885+02	Maonde Dangare	maonde-dangare	t	12	\N
306	2025-07-11 12:47:23.322845+02	2025-07-11 12:57:05.725043+02	Muneni	muneni	t	12	\N
307	2025-07-11 12:47:23.34232+02	2025-07-11 12:57:05.74099+02	Madanza	madanza	t	12	\N
308	2025-07-11 12:47:23.366795+02	2025-07-11 12:57:05.759344+02	Park Cottages	park-cottages	t	12	\N
309	2025-07-11 12:47:23.402876+02	2025-07-11 12:57:05.778057+02	Nyakamete	nyakamete	t	12	\N
310	2025-07-11 12:47:23.433805+02	2025-07-11 12:57:05.792196+02	Nyanga	nyanga	t	13	\N
311	2025-07-11 12:47:23.463198+02	2025-07-11 12:57:05.812305+02	Rusape	rusape	t	14	\N
312	2025-07-11 12:47:23.491014+02	2025-07-11 12:57:05.827513+02	Vumba	vumba	t	15	\N
313	2025-07-11 12:47:23.509365+02	2025-07-11 12:57:05.838352+02	Penhalonga	penhalonga	t	16	\N
314	2025-07-11 12:47:23.540232+02	2025-07-11 12:57:05.850979+02	Bikita	bikita	t	17	\N
315	2025-07-11 12:47:23.58087+02	2025-07-11 12:57:05.870373+02	Chiredzi	chiredzi	t	18	\N
316	2025-07-11 12:47:23.612695+02	2025-07-11 12:57:05.88714+02	Gutu	gutu	t	19	\N
317	2025-07-11 12:47:23.639848+02	2025-07-11 12:57:05.900712+02	Masvingo	masvingo	t	20	\N
318	2025-07-11 12:47:23.659419+02	2025-07-11 12:57:05.918909+02	Mwenezi	mwenezi	t	21	\N
319	2025-07-11 12:47:23.689725+02	2025-07-11 12:57:05.939516+02	Rutenga	rutenga	t	22	\N
320	2025-07-11 12:47:23.723023+02	2025-07-11 12:57:05.961413+02	Triangle	triangle	t	23	\N
321	2025-07-11 12:47:23.743608+02	2025-07-11 12:57:05.984265+02	Zaka	zaka	t	24	\N
322	2025-07-11 12:47:23.768765+02	2025-07-11 12:57:06.001793+02	Arcturus	arcturus	t	25	\N
323	2025-07-11 12:47:23.797054+02	2025-07-11 12:57:06.020003+02	Beatrice	beatrice	t	26	\N
324	2025-07-11 12:47:23.821488+02	2025-07-11 12:57:06.036783+02	Chikomba	chikomba	t	27	\N
325	2025-07-11 12:47:23.846712+02	2025-07-11 12:57:06.053707+02	Chivhu	chivhu	t	28	\N
326	2025-07-11 12:47:23.868637+02	2025-07-11 12:57:06.069573+02	Damofalls	damofalls	t	29	\N
327	2025-07-11 12:47:23.890275+02	2025-07-11 12:57:06.084821+02	Goromonzi	goromonzi	t	30	\N
328	2025-07-11 12:47:23.915677+02	2025-07-11 12:57:06.102378+02	Marondera	marondera	t	31	\N
329	2025-07-11 12:47:23.945357+02	2025-07-11 12:57:06.119501+02	Mudzi	mudzi	t	32	\N
330	2025-07-11 12:47:23.973703+02	2025-07-11 12:57:06.141709+02	Murehwa	murehwa	t	33	\N
331	2025-07-11 12:47:23.995825+02	2025-07-11 12:57:06.161672+02	Mutoko	mutoko	t	34	\N
332	2025-07-11 12:47:24.021636+02	2025-07-11 12:57:06.178934+02	Seke	seke	t	35	\N
333	2025-07-11 12:47:24.039879+02	2025-07-11 12:57:06.193155+02	Wedza	wedza	t	36	\N
334	2025-07-11 12:47:24.067445+02	2025-07-11 12:57:06.208947+02	Domboshawa	domboshawa	t	37	\N
335	2025-07-11 12:47:24.102076+02	2025-07-11 12:57:06.226196+02	Dema	dema	t	38	\N
336	2025-07-11 12:47:24.127665+02	2025-07-11 12:57:06.239967+02	Macheke	macheke	t	39	\N
337	2025-07-11 12:47:24.151084+02	2025-07-11 12:57:06.257227+02	Bindura	bindura	t	40	\N
339	2025-07-11 12:47:24.215716+02	2025-07-11 12:57:06.290935+02	Christon	christon	t	42	\N
340	2025-07-11 12:47:24.241754+02	2025-07-11 12:57:06.306884+02	Concession	concession	t	43	\N
341	2025-07-11 12:47:24.266924+02	2025-07-11 12:57:06.325+02	Guruve	guruve	t	44	\N
342	2025-07-11 12:47:24.305239+02	2025-07-11 12:57:06.339966+02	Mazowe	mazowe	t	45	\N
343	2025-07-11 12:47:24.3452+02	2025-07-11 12:57:06.353964+02	Mt Darwin	mt-darwin	t	46	\N
344	2025-07-11 12:47:24.369514+02	2025-07-11 12:57:06.370931+02	Mvurwi	mvurwi	t	47	\N
345	2025-07-11 12:47:24.393157+02	2025-07-11 12:57:06.385032+02	Rushinga	rushinga	t	48	\N
346	2025-07-11 12:47:24.430272+02	2025-07-11 12:57:06.40266+02	Shamva	shamva	t	49	\N
347	2025-07-11 12:47:24.460034+02	2025-07-11 12:57:06.415992+02	Mbire	mbire	t	50	\N
338	2025-07-11 12:47:24.186138+02	2025-07-11 12:57:06.432941+02	Centenary	centenary	t	41	\N
348	2025-07-11 12:47:24.510377+02	2025-07-11 12:57:06.449654+02	Banket	banket	t	51	\N
349	2025-07-11 12:47:24.540503+02	2025-07-11 12:57:06.464496+02	Chegutu	chegutu	t	52	\N
350	2025-07-11 12:47:24.57314+02	2025-07-11 12:57:06.476969+02	Chinhoyi	chinhoyi	t	53	\N
351	2025-07-11 12:47:24.604309+02	2025-07-11 12:57:06.501034+02	Chirundu	chirundu	t	54	\N
352	2025-07-11 12:47:24.630007+02	2025-07-11 12:57:06.517902+02	Darwendale	darwendale	t	55	\N
353	2025-07-11 12:47:24.665411+02	2025-07-11 12:57:06.530897+02	Hurungwe	hurungwe	t	56	\N
354	2025-07-11 12:47:24.691014+02	2025-07-11 12:57:06.548076+02	Kadoma	kadoma	t	57	\N
355	2025-07-11 12:47:24.728264+02	2025-07-11 12:57:06.563651+02	Kariba	kariba	t	58	\N
356	2025-07-11 12:47:24.756101+02	2025-07-11 12:57:06.577801+02	Milibizi	milibizi	t	58	\N
357	2025-07-11 12:47:24.779301+02	2025-07-11 12:57:06.592972+02	Matusadona National Park	matusadona-national-park	t	58	\N
358	2025-07-11 12:47:24.804565+02	2025-07-11 12:57:06.613045+02	Karoi	karoi	t	59	\N
359	2025-07-11 12:47:24.83753+02	2025-07-11 12:57:06.626425+02	Lake	lake	t	60	\N
360	2025-07-11 12:47:24.860704+02	2025-07-11 12:57:06.644328+02	Lower	lower	t	61	\N
361	2025-07-11 12:47:24.887123+02	2025-07-11 12:57:06.657741+02	Makonde	makonde	t	62	\N
362	2025-07-11 12:47:24.912928+02	2025-07-11 12:57:06.67377+02	Mazvikadei	mazvikadei	t	63	\N
363	2025-07-11 12:47:24.939297+02	2025-07-11 12:57:06.693784+02	Norton	norton	t	64	\N
364	2025-07-11 12:47:24.970278+02	2025-07-11 12:57:06.707759+02	Zambezi	zambezi	t	65	\N
365	2025-07-11 12:47:24.998967+02	2025-07-11 12:57:06.723001+02	Zvimba	zvimba	t	66	\N
366	2025-07-11 12:47:25.028694+02	2025-07-11 12:57:06.741055+02	Selous	selous	t	67	\N
367	2025-07-11 12:47:25.052697+02	2025-07-11 12:57:06.759031+02	Raffingora	raffingora	t	68	\N
368	2025-07-11 12:47:25.100827+02	2025-07-11 12:57:06.778928+02	Mhangura	mhangura	t	69	\N
369	2025-07-11 12:47:25.127623+02	2025-07-11 12:57:06.794098+02	Chirumhanzu	chirumhanzu	t	70	\N
370	2025-07-11 12:47:25.152492+02	2025-07-11 12:57:06.810118+02	Gokwe	gokwe	t	71	\N
371	2025-07-11 12:47:25.193547+02	2025-07-11 12:57:06.831469+02	Mkoba	mkoba	t	72	\N
372	2025-07-11 12:47:25.221835+02	2025-07-11 12:57:06.847964+02	Southdowns	southdowns	t	72	\N
373	2025-07-11 12:47:25.251642+02	2025-07-11 12:57:06.863261+02	Northlea	northlea	t	72	\N
374	2025-07-11 12:47:25.283089+02	2025-07-11 12:57:06.880073+02	Lundi Park	lundi-park	t	72	\N
375	2025-07-11 12:47:25.307309+02	2025-07-11 12:57:06.899431+02	Riverside	riverside	t	72	\N
376	2025-07-11 12:47:25.334769+02	2025-07-11 12:57:06.914931+02	Harben park	harben-park	t	72	\N
377	2025-07-11 12:47:25.366729+02	2025-07-11 12:57:06.926773+02	St Annes drive	st-annes-drive	t	72	\N
378	2025-07-11 12:47:25.39131+02	2025-07-11 12:57:06.946899+02	Kopje	kopje	t	72	\N
379	2025-07-11 12:47:25.41707+02	2025-07-11 12:57:06.964716+02	Brackenhurst	brackenhurst	t	72	\N
380	2025-07-11 12:47:25.439843+02	2025-07-11 12:57:06.980993+02	Windsor Park	windsor-park	t	72	\N
381	2025-07-11 12:47:25.464009+02	2025-07-11 12:57:06.991849+02	Shamrock Park	shamrock-park	t	72	\N
382	2025-07-11 12:47:25.496573+02	2025-07-11 12:57:07.008752+02	Nashville	nashville	t	72	\N
383	2025-07-11 12:47:25.518699+02	2025-07-11 12:57:07.023601+02	Daylesford	daylesford	t	72	\N
384	2025-07-11 12:47:25.543877+02	2025-07-11 12:57:07.041731+02	Senga	senga	t	72	\N
385	2025-07-11 12:47:25.574236+02	2025-07-11 12:57:07.059796+02	Nehosho	nehosho	t	72	\N
386	2025-07-11 12:47:25.600712+02	2025-07-11 12:57:07.08068+02	Gweru CBD	gweru-cbd	t	72	\N
387	2025-07-11 12:47:25.627776+02	2025-07-11 12:57:07.101922+02	Gweru East	gweru-east	t	72	\N
528	2025-07-11 12:57:07.127073+02	2025-07-11 12:57:07.127093+02	Athlone	athlone-1-2	t	72	\N
389	2025-07-11 12:47:25.685837+02	2025-07-11 12:57:07.143787+02	Mambo	mambo	t	72	\N
390	2025-07-11 12:47:25.709176+02	2025-07-11 12:57:07.155418+02	Mtapa	mtapa	t	72	\N
391	2025-07-11 12:47:25.739264+02	2025-07-11 12:57:07.174412+02	Cliffton Park	cliffton-park	t	72	\N
392	2025-07-11 12:47:25.770271+02	2025-07-11 12:57:07.188785+02	Montrose	montrose	t	72	\N
393	2025-07-11 12:47:25.805032+02	2025-07-11 12:57:07.204992+02	Woodlands Park	woodlands-park	t	72	\N
394	2025-07-11 12:47:25.836881+02	2025-07-11 12:57:07.221523+02	Ridgemont	ridgemont	t	72	\N
395	2025-07-11 12:47:25.865767+02	2025-07-11 12:57:07.236025+02	Hertfordshire	hertfordshire	t	72	\N
396	2025-07-11 12:47:25.891325+02	2025-07-11 12:57:07.25897+02	Greenvale	greenvale	t	72	\N
397	2025-07-11 12:47:25.91339+02	2025-07-11 12:57:07.277416+02	Northgate Heights	northgate-heights	t	72	\N
398	2025-07-11 12:47:25.936656+02	2025-07-11 12:57:07.291279+02	Ivene	ivene	t	72	\N
399	2025-07-11 12:47:25.95849+02	2025-07-11 12:57:07.307785+02	Southview	southview	t	72	\N
400	2025-07-11 12:47:25.982011+02	2025-07-11 12:57:07.327372+02	Adelaide Pk Gweru	adelaide-pk-gweru	t	72	\N
401	2025-07-11 12:47:26.006203+02	2025-07-11 12:57:07.338683+02	Kingston Park	kingston-park	t	72	\N
402	2025-07-11 12:47:26.02609+02	2025-07-11 12:57:07.352769+02	Mtausi Park	mtausi-park	t	72	\N
403	2025-07-11 12:47:26.052116+02	2025-07-11 12:57:07.372677+02	Pattergonia	pattergonia	t	72	\N
404	2025-07-11 12:47:26.075997+02	2025-07-11 12:57:07.392012+02	Bradeleys Plots	bradeleys-plots	t	72	\N
405	2025-07-11 12:47:26.101493+02	2025-07-11 12:57:07.408716+02	Lynfield	lynfield	t	72	\N
406	2025-07-11 12:47:26.130712+02	2025-07-11 12:57:07.426712+02	Coolmoreen	coolmoreen	t	72	\N
407	2025-07-11 12:47:26.166847+02	2025-07-11 12:57:07.445661+02	Hertifordshire	hertifordshire	t	72	\N
408	2025-07-11 12:47:26.196852+02	2025-07-11 12:57:07.466209+02	Kwekwe	kwekwe	t	73	\N
409	2025-07-11 12:47:26.223727+02	2025-07-11 12:57:07.493022+02	Mberengwa	mberengwa	t	74	\N
410	2025-07-11 12:47:26.245879+02	2025-07-11 12:57:07.512628+02	Redcliff	redcliff	t	75	\N
411	2025-07-11 12:47:26.274576+02	2025-07-11 12:57:07.533049+02	Shurugwi	shurugwi	t	76	\N
412	2025-07-11 12:47:26.302001+02	2025-07-11 12:57:07.56084+02	Zvishavane	zvishavane	t	77	\N
413	2025-07-11 12:47:26.333929+02	2025-07-11 12:57:07.581796+02	Mvuma	mvuma	t	78	\N
414	2025-07-11 12:47:26.35732+02	2025-07-11 12:57:07.595102+02	Binga	binga	t	79	\N
415	2025-07-11 12:47:26.386111+02	2025-07-11 12:57:07.614673+02	Bubi	bubi	t	80	\N
416	2025-07-11 12:47:26.414378+02	2025-07-11 12:57:07.632273+02	Deka	deka	t	81	\N
417	2025-07-11 12:47:26.432482+02	2025-07-11 12:57:07.647877+02	Hwange	hwange	t	82	\N
418	2025-07-11 12:47:26.457941+02	2025-07-11 12:57:07.664761+02	Lupane	lupane	t	83	\N
419	2025-07-11 12:47:26.479503+02	2025-07-11 12:57:07.678506+02	Msuna	msuna	t	84	\N
420	2025-07-11 12:47:26.501376+02	2025-07-11 12:57:07.696036+02	Nkayi	nkayi	t	85	\N
421	2025-07-11 12:47:26.524585+02	2025-07-11 12:57:07.712426+02	Tsholotsho	tsholotsho	t	86	\N
422	2025-07-11 12:47:26.550102+02	2025-07-11 12:57:07.730359+02	Umguza	umguza	t	87	\N
423	2025-07-11 12:47:26.582093+02	2025-07-11 12:57:07.742922+02	Victoria Falls	victoria-falls	t	88	\N
424	2025-07-11 12:47:26.6097+02	2025-07-11 12:57:07.754949+02	Beitbridge	beitbridge	t	89	\N
425	2025-07-11 12:47:26.63339+02	2025-07-11 12:57:07.774837+02	Bulilimamangwe	bulilimamangwe	t	90	\N
426	2025-07-11 12:47:26.65704+02	2025-07-11 12:57:07.790785+02	Figtree	figtree	t	91	\N
427	2025-07-11 12:47:26.684357+02	2025-07-11 12:57:07.812235+02	Gwanda	gwanda	t	92	\N
428	2025-07-11 12:47:26.706096+02	2025-07-11 12:57:07.835889+02	Insiza	insiza	t	93	\N
429	2025-07-11 12:47:26.731406+02	2025-07-11 12:57:07.85002+02	Matobo	matobo	t	94	\N
430	2025-07-11 12:47:26.760646+02	2025-07-11 12:57:07.866536+02	Plumtree	plumtree	t	95	\N
431	2025-07-11 12:47:26.789832+02	2025-07-11 12:57:07.885298+02	Shangani	shangani	t	96	\N
432	2025-07-11 12:47:26.807057+02	2025-07-11 12:57:07.910122+02	Umzingwane	umzingwane	t	97	\N
433	2025-07-11 12:47:26.843381+02	2025-07-11 12:57:07.928368+02	Sandton	sandton	t	98	\N
434	2025-07-11 12:47:26.864734+02	2025-07-11 12:57:07.944098+02	Bryanston	bryanston	t	98	\N
435	2025-07-11 12:47:26.886845+02	2025-07-11 12:57:07.958912+02	Pretoria	pretoria	t	99	\N
436	2025-07-11 12:47:26.908493+02	2025-07-11 12:57:07.97868+02	Cape Town	cape-town	t	100	\N
529	2025-07-11 12:57:07.999212+02	2025-07-11 12:57:07.99924+02	Hillcrest	hillcrest-1-2	t	101	\N
438	2025-07-11 12:47:26.961507+02	2025-07-11 12:57:08.016049+02	Kloof	kloof	t	102	\N
439	2025-07-11 12:47:26.986689+02	2025-07-11 12:57:08.03302+02	Waterfall	waterfall	t	103	\N
440	2025-07-11 12:47:27.011142+02	2025-07-11 12:57:08.046448+02	Gillitts	gillitts	t	104	\N
441	2025-07-11 12:47:27.039996+02	2025-07-11 12:57:08.058813+02	Assagay	assagay	t	105	\N
442	2025-07-11 12:47:27.071853+02	2025-07-11 12:57:08.073086+02	Bothas Hill	bothas-hill	t	106	\N
443	2025-07-11 12:47:27.121606+02	2025-07-11 12:57:08.09628+02	Crestholme	crestholme	t	107	\N
444	2025-07-11 12:47:27.155326+02	2025-07-11 12:57:08.114645+02	Summerveld	summerveld	t	108	\N
445	2025-07-11 12:47:27.17826+02	2025-07-11 12:57:08.131004+02	Mangochi	mangochi	t	109	\N
446	2025-07-11 12:47:27.203541+02	2025-07-11 12:57:08.145193+02	Mangochi Town Center	mangochi-town-center	t	110	\N
447	2025-07-11 12:47:27.224175+02	2025-07-11 12:57:08.159973+02	Mangochi Township	mangochi-township	t	111	\N
448	2025-07-11 12:47:27.250547+02	2025-07-11 12:57:08.181009+02	Mponda	mponda	t	112	\N
449	2025-07-11 12:47:27.279248+02	2025-07-11 12:57:08.196073+02	Maldeco	maldeco	t	113	\N
450	2025-07-11 12:47:27.301633+02	2025-07-11 12:57:08.209106+02	Mbwadzulu	mbwadzulu	t	114	\N
451	2025-07-11 12:47:27.332136+02	2025-07-11 12:57:08.230301+02	Chiponde	chiponde	t	115	\N
452	2025-07-11 12:47:27.354944+02	2025-07-11 12:57:08.246458+02	Nankumba	nankumba	t	116	\N
453	2025-07-11 12:47:27.380345+02	2025-07-11 12:57:08.258547+02	Chilipa	chilipa	t	117	\N
454	2025-07-11 12:47:27.408595+02	2025-07-11 12:57:08.273322+02	Mangochi Boma	mangochi-boma	t	118	\N
455	2025-07-11 12:47:27.433757+02	2025-07-11 12:57:08.286976+02	Pemba	pemba	t	119	\N
456	2025-07-11 12:47:27.463255+02	2025-07-11 12:57:08.304092+02	Montepuez	montepuez	t	120	\N
457	2025-07-11 12:47:27.488045+02	2025-07-11 12:57:08.316776+02	Mocímboa da Praia	mocimboa-da-praia	t	121	\N
458	2025-07-11 12:47:27.511219+02	2025-07-11 12:57:08.332043+02	Palma	palma	t	122	\N
459	2025-07-11 12:47:27.549223+02	2025-07-11 12:57:08.347399+02	Macomia	macomia	t	123	\N
460	2025-07-11 12:47:27.589367+02	2025-07-11 12:57:08.36542+02	Quissanga	quissanga	t	124	\N
461	2025-07-11 12:47:27.615577+02	2025-07-11 12:57:08.384562+02	Metuge	metuge	t	125	\N
462	2025-07-11 12:47:27.648514+02	2025-07-11 12:57:08.398831+02	Chiúre	chiure	t	126	\N
463	2025-07-11 12:47:27.668065+02	2025-07-11 12:57:08.413848+02	Ancuabe	ancuabe	t	127	\N
464	2025-07-11 12:47:27.693071+02	2025-07-11 12:57:08.426523+02	Ibo	ibo	t	128	\N
465	2025-07-11 12:47:27.722872+02	2025-07-11 12:57:08.443661+02	Mueda	mueda	t	129	\N
466	2025-07-11 12:47:27.74869+02	2025-07-11 12:57:08.461017+02	Meluco	meluco	t	130	\N
467	2025-07-11 12:47:27.781373+02	2025-07-11 12:57:08.477571+02	Centro	centro	t	131	\N
468	2025-07-11 12:47:27.8063+02	2025-07-11 12:57:08.495298+02	Paquitequete	paquitequete	t	132	\N
469	2025-07-11 12:47:27.835221+02	2025-07-11 12:57:08.512274+02	Murrebue	murrebue	t	133	\N
470	2025-07-11 12:47:27.873221+02	2025-07-11 12:57:08.536668+02	Chali	chali	t	134	\N
471	2025-07-11 12:47:27.895866+02	2025-07-11 12:57:08.554229+02	Cimento	cimento	t	135	\N
472	2025-07-11 12:47:27.913134+02	2025-07-11 12:57:08.575074+02	Ponta Vermelha	ponta-vermelha	t	136	\N
473	2025-07-11 12:47:27.932743+02	2025-07-11 12:57:08.592517+02	Bairro Novo	bairro-novo	t	137	\N
474	2025-07-11 12:47:27.950925+02	2025-07-11 12:57:08.613673+02	Nanhime	nanhime	t	138	\N
475	2025-07-11 12:47:27.970654+02	2025-07-11 12:57:08.634446+02	Murrupula	murrupula	t	139	\N
476	2025-07-11 12:47:27.987791+02	2025-07-11 12:57:08.652184+02	Muapula	muapula	t	140	\N
477	2025-07-11 12:47:28.005623+02	2025-07-11 12:57:08.678184+02	Mutiva	mutiva	t	141	\N
478	2025-07-11 12:47:28.02725+02	2025-07-11 12:57:08.703374+02	Muiuane	muiuane	t	142	\N
479	2025-07-11 12:47:28.045239+02	2025-07-11 12:57:08.727623+02	Mussoromosso	mussoromosso	t	143	\N
480	2025-07-11 12:47:28.061361+02	2025-07-11 12:57:08.746794+02	Alto da Manga	alto-da-manga	t	144	\N
481	2025-07-11 12:47:28.084822+02	2025-07-11 12:57:08.761122+02	Mia Couto	mia-couto	t	145	\N
482	2025-07-11 12:47:28.105122+02	2025-07-11 12:57:08.7845+02	Baixa	baixa	t	146	\N
483	2025-07-11 12:47:28.125299+02	2025-07-11 12:57:08.805687+02	Mucojo	mucojo	t	147	\N
484	2025-07-11 12:47:28.143151+02	2025-07-11 12:57:08.830754+02	Manilha	manilha	t	148	\N
485	2025-07-11 12:47:28.16212+02	2025-07-11 12:57:08.847312+02	Areias	areias	t	149	\N
486	2025-07-11 12:47:28.17846+02	2025-07-11 12:57:08.866746+02	Quibuidine	quibuidine	t	150	\N
487	2025-07-11 12:47:28.196858+02	2025-07-11 12:57:08.889492+02	Zona Verde	zona-verde	t	151	\N
488	2025-07-11 12:47:28.214776+02	2025-07-11 12:57:08.915687+02	Nova Vida	nova-vida	t	152	\N
489	2025-07-11 12:47:28.232159+02	2025-07-11 12:57:08.939531+02	Quelimane	quelimane	t	153	\N
490	2025-07-11 12:47:28.249069+02	2025-07-11 12:57:08.96625+02	Muxúnguè	muxungue	t	154	\N
491	2025-07-11 12:47:28.267949+02	2025-07-11 12:57:08.981016+02	Pangane	pangane	t	155	\N
492	2025-07-11 12:47:28.291042+02	2025-07-11 12:57:08.998135+02	Matemo	matemo	t	156	\N
493	2025-07-11 12:47:28.312044+02	2025-07-11 12:57:09.015608+02	Quionga	quionga	t	157	\N
494	2025-07-11 12:47:28.349453+02	2025-07-11 12:57:09.031789+02	Mecufi	mecufi	t	158	\N
495	2025-07-11 12:47:28.375352+02	2025-07-11 12:57:09.049191+02	Nacotuco	nacotuco	t	159	\N
496	2025-07-11 12:47:28.40014+02	2025-07-11 12:57:09.064289+02	Mecula	mecula	t	160	\N
497	2025-07-11 12:47:28.430166+02	2025-07-11 12:57:09.081193+02	Meza	meza	t	161	\N
498	2025-07-11 12:47:28.460125+02	2025-07-11 12:57:09.10266+02	Nairoto	nairoto	t	162	\N
499	2025-07-11 12:47:28.504754+02	2025-07-11 12:57:09.123942+02	M'punga	mpunga	t	163	\N
500	2025-07-11 12:47:28.522426+02	2025-07-11 12:57:09.142368+02	Cobaia	cobaia	t	164	\N
501	2025-07-11 12:47:28.559637+02	2025-07-11 12:57:09.158899+02	Napupa	napupa	t	165	\N
502	2025-07-11 12:47:28.584496+02	2025-07-11 12:57:09.172452+02	Napapa	napapa	t	166	\N
503	2025-07-11 12:47:28.612267+02	2025-07-11 12:57:09.190051+02	Nacujo	nacujo	t	167	\N
504	2025-07-11 12:47:28.636499+02	2025-07-11 12:57:09.206889+02	Napome	napome	t	168	\N
505	2025-07-11 12:47:28.657441+02	2025-07-11 12:57:09.2258+02	Nagaze	nagaze	t	169	\N
506	2025-07-11 12:47:28.673266+02	2025-07-11 12:57:09.240783+02	Porto	porto	t	170	\N
507	2025-07-11 12:47:28.690013+02	2025-07-11 12:57:09.254089+02	Fortaleza	fortaleza	t	171	\N
508	2025-07-11 12:47:28.71104+02	2025-07-11 12:57:09.269607+02	Cabo	cabo	t	172	\N
509	2025-07-11 12:47:28.741539+02	2025-07-11 12:57:09.291359+02	Makuti	makuti	t	173	\N
510	2025-07-11 12:47:28.76207+02	2025-07-11 12:57:09.304819+02	Administrative Center	administrative-center	t	174	\N
511	2025-07-11 12:47:28.790857+02	2025-07-11 12:57:09.319535+02	Local Villages	local-villages	t	175	\N
512	2025-07-11 12:47:28.817975+02	2025-07-11 12:57:09.340249+02	Rural Communities	rural-communities	t	176	\N
513	2025-07-11 12:47:28.843214+02	2025-07-11 12:57:09.356675+02	Agricultural Areas	agricultural-areas	t	177	\N
514	2025-07-11 12:47:28.882171+02	2025-07-11 12:57:09.370882+02	Market Centers	market-centers	t	178	\N
515	2025-07-11 12:47:28.908677+02	2025-07-11 12:57:09.398167+02	Traditional Communal Areas	traditional-communal-areas	t	179	\N
516	2025-07-11 12:47:28.926087+02	2025-07-11 12:57:09.420747+02	Machava	machava	t	180	\N
517	2025-07-11 12:47:28.9467+02	2025-07-11 12:57:09.440299+02	Mavalane	mavalane	t	180	\N
518	2025-07-11 12:47:28.965241+02	2025-07-11 12:57:09.454827+02	Polana	polana	t	180	\N
519	2025-07-11 12:47:28.983826+02	2025-07-11 12:57:09.474113+02	Sommerschield	sommerschield	t	180	\N
520	2025-07-11 12:47:29.006862+02	2025-07-11 12:57:09.490124+02	Costa do Sol	costa-do-sol	t	180	\N
530	2025-07-11 12:57:09.512768+02	2025-07-11 12:57:09.512794+02	Baixa	baixa-1-2	t	180	\N
522	2025-07-11 12:47:29.064656+02	2025-07-11 12:57:09.535715+02	Museu	museu	t	180	\N
523	2025-07-11 12:47:29.088453+02	2025-07-11 12:57:09.550793+02	Central A	central-a	t	180	\N
524	2025-07-11 12:47:29.11472+02	2025-07-11 12:57:09.568178+02	Rietfontein	rietfontein	t	3	\N
525	2025-07-11 12:47:29.145078+02	2025-07-11 12:57:09.5917+02	Avenues (Harare)	avenues-harare	t	3	\N
288	2025-07-11 12:47:22.868536+02	2025-07-11 12:57:09.620418+02	Avenues (Mutare)	avenues-mutare	t	12	\N
121	2025-07-11 12:47:16.352293+02	2025-07-11 12:57:09.643457+02	Bluff Hill	bluff-hill	t	3	\N
526	2025-07-11 12:47:29.232786+02	2025-07-11 12:57:09.665166+02	Nyabira	nyabira	t	3	\N
183	2025-07-11 12:47:18.50644+02	2025-07-11 12:57:09.700167+02	Burnside	burnside	t	4	\N
527	2025-07-11 12:47:29.302019+02	2025-07-11 12:57:09.735371+02	Mount Hampden	mount-hampden	t	3	\N
\.


--
-- Data for Name: common_address; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_address (id, date_created, date_updated, object_id, address_type, is_primary, street_address, line_2, postal_code, latitude, longitude, city_id, content_type_id, country_id, province_id, suburb_id, user_id) FROM stdin;
1	2025-07-11 17:24:49.043919+02	2025-07-11 17:24:49.043954+02	1	physical	f	123 Test St	\N	\N	\N	\N	1	21	7	1	\N	\N
4	2025-07-14 11:42:23.591809+02	2025-07-14 11:42:23.591832+02	3	physical	t	123 Main Street	Suite 200	2000	\N	\N	1	21	7	1	5	\N
5	2025-07-14 11:42:23.606379+02	2025-07-14 11:42:23.606398+02	3	postal	t	PO Box 123	\N	2001	\N	\N	1	21	7	1	\N	\N
7	2025-07-14 15:22:07.077584+02	2025-07-14 15:22:07.077631+02	8	physical	t	123 Main Street	Suite 200	2000	\N	\N	7	19	7	3	5	\N
9	2025-07-14 15:54:04.41425+02	2025-07-14 15:54:04.41427+02	5	physical	f	123 New Street	\N	\N	\N	\N	9	22	7	3	\N	\N
12	2025-07-14 16:19:58.798356+02	2025-07-14 16:19:58.798385+02	6	physical	t	456 New Street	\N	\N	\N	\N	4	22	7	2	\N	\N
16	2025-07-14 16:21:58.799955+02	2025-07-14 16:21:58.800009+02	2	physical	t	123 Main Street	Suite 200	2000	\N	\N	2	21	7	1	20	\N
17	2025-07-15 11:50:51.299879+02	2025-07-15 11:50:51.299945+02	9	physical	t	123 Main Street	Suite 200	\N	\N	\N	7	19	7	1	5	\N
18	2025-07-15 11:54:55.683078+02	2025-07-15 11:54:55.683122+02	10	physical	t	123 Main Street	Suite 200	\N	\N	\N	7	19	7	1	5	\N
19	2025-07-15 14:29:21.42029+02	2025-07-15 14:29:21.420325+02	11	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
20	2025-07-16 10:52:05.892694+02	2025-07-16 10:52:05.892734+02	3	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
21	2025-07-17 12:34:02.117535+02	2025-07-17 12:34:02.117554+02	17	physical	t	456 New Street	\N	\N	\N	\N	4	22	7	2	186	\N
22	2025-07-17 15:55:29.905914+02	2025-07-17 15:55:29.905936+02	18	physical	t	456 New Street	\N	\N	\N	\N	4	22	7	2	186	\N
25	2025-07-18 09:44:55.837247+02	2025-07-18 09:44:55.837297+02	10	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	\N
26	2025-07-18 09:44:55.885816+02	2025-07-18 09:44:55.885838+02	10	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	\N
27	2025-07-18 09:44:56.006522+02	2025-07-18 09:44:56.006543+02	19	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
28	2025-07-18 09:50:56.905966+02	2025-07-18 09:50:56.905986+02	12	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	\N
29	2025-07-18 09:50:56.92778+02	2025-07-18 09:50:56.927799+02	12	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	\N
30	2025-07-18 09:50:57.013089+02	2025-07-18 09:50:57.013111+02	20	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
31	2025-07-18 10:01:55.759917+02	2025-07-18 10:01:55.759933+02	14	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	\N
32	2025-07-18 10:01:55.791811+02	2025-07-18 10:01:55.791831+02	14	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	\N
33	2025-07-18 10:01:55.854383+02	2025-07-18 10:01:55.854403+02	22	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
34	2025-07-18 10:16:22.857152+02	2025-07-18 10:16:22.857168+02	15	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	1
35	2025-07-18 10:16:22.878864+02	2025-07-18 10:16:22.878878+02	15	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	1
36	2025-07-18 10:16:22.936975+02	2025-07-18 10:16:22.936996+02	23	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
37	2025-07-18 10:37:08.321629+02	2025-07-18 10:37:08.321649+02	24	physical	t	456 New Street	\N	\N	\N	\N	4	22	7	2	186	\N
38	2025-07-18 10:38:44.428523+02	2025-07-18 10:38:44.428543+02	25	physical	t	456 New Street	\N	\N	\N	\N	4	22	7	2	186	\N
39	2025-07-18 10:44:41.44275+02	2025-07-18 10:44:41.442762+02	16	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	1
40	2025-07-18 10:44:41.491863+02	2025-07-18 10:44:41.491906+02	16	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	1
41	2025-07-18 10:44:41.617427+02	2025-07-18 10:44:41.617447+02	26	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
42	2025-07-18 11:30:05.750583+02	2025-07-18 11:30:05.750597+02	17	physical	t	123 Main St	\N	\N	\N	\N	4	21	7	2	186	1
43	2025-07-18 11:30:05.771671+02	2025-07-18 11:30:05.771683+02	17	postal	t	PO Box 123	\N	12345	\N	\N	1	21	7	1	\N	1
44	2025-07-18 11:30:05.837524+02	2025-07-18 11:30:05.837542+02	27	physical	t	123 Main St	\N	\N	\N	\N	4	22	7	2	186	\N
47	2025-07-18 11:54:52.548451+02	2025-07-18 11:54:52.548468+02	17	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
48	2025-07-18 12:05:21.507265+02	2025-07-18 12:05:21.507288+02	18	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
49	2025-07-18 12:26:13.966068+02	2025-07-18 12:26:13.966084+02	19	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
53	2025-07-18 16:50:45.340292+02	2025-07-18 16:50:45.340312+02	20	physical	f	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
54	2025-07-18 17:00:50.022107+02	2025-07-18 17:00:50.022138+02	21	physical	t	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
56	2025-07-21 08:35:16.125134+02	2025-07-21 08:35:16.125235+02	22	physical	f	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
57	2025-07-21 08:55:50.562401+02	2025-07-21 08:55:50.562435+02	24	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
58	2025-07-21 10:30:18.850073+02	2025-07-21 10:30:18.850089+02	25	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
59	2025-07-21 15:57:11.504551+02	2025-07-21 15:57:11.50457+02	26	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
60	2025-07-21 16:26:03.909829+02	2025-07-21 16:26:03.909849+02	27	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
63	2025-07-22 09:36:58.359894+02	2025-07-22 09:36:58.359922+02	30	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
64	2025-07-22 09:42:05.578301+02	2025-07-22 09:42:05.57832+02	31	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
65	2025-07-22 09:50:02.799381+02	2025-07-22 09:50:02.799399+02	32	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
66	2025-07-22 10:19:17.283231+02	2025-07-22 10:19:17.283248+02	33	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
67	2025-07-22 10:27:05.870891+02	2025-07-22 10:27:05.87097+02	34	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
68	2025-07-22 10:51:14.625516+02	2025-07-22 10:51:14.625562+02	35	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
69	2025-07-22 11:05:09.239632+02	2025-07-22 11:05:09.239713+02	36	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
70	2025-07-22 13:09:27.875501+02	2025-07-22 13:09:27.875511+02	23	physical	t	34 masasa main	\N	00263	\N	\N	3	21	7	1	94	1
71	2025-07-22 13:09:27.954975+02	2025-07-22 13:09:27.955001+02	32	physical	t	34 masasa main	\N	00263	\N	\N	3	22	7	1	94	\N
72	2025-07-22 14:41:58.103414+02	2025-07-22 14:41:58.103451+02	37	physical	t	123 Main Street	Suite 200	\N	\N	\N	4	19	7	2	186	\N
73	2025-07-22 15:56:36.960014+02	2025-07-22 15:56:36.960048+02	37	physical	f	123 Main Street	Suite 200	\N	\N	\N	1	19	7	1	\N	\N
\.


--
-- Data for Name: common_document; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_document (id, date_created, date_updated, object_id, document_type, file, description, is_verified, content_type_id, user_id) FROM stdin;
1	2025-07-18 09:44:55.896208+02	2025-07-18 09:44:55.896228+02	10	contract	documents/file.pdf	Contract PDF	f	21	\N
2	2025-07-18 09:50:56.931338+02	2025-07-18 09:50:56.931353+02	12	contract	documents/file_M5ifTZp.pdf	Contract PDF	f	21	\N
3	2025-07-18 10:01:55.795869+02	2025-07-18 10:01:55.795888+02	14	contract	documents/file_ZecgPCU.pdf	Contract PDF	f	21	\N
4	2025-07-18 10:16:22.881801+02	2025-07-18 10:16:22.881813+02	15	contract	documents/file_pYS6tR4.pdf	Contract PDF	f	21	1
5	2025-07-18 10:44:41.506819+02	2025-07-18 10:44:41.506841+02	16	contract	documents/file_xhtQrcm.pdf	Contract PDF	f	21	1
6	2025-07-18 11:30:05.774494+02	2025-07-18 11:30:05.774511+02	17	contract	documents/file_r38fzEp.pdf	Contract PDF	f	21	1
7	2025-07-18 11:54:52.560464+02	2025-07-18 11:54:52.560478+02	17	id	documents/file_TwXSXti.pdf	National Identification Card	f	19	\N
8	2025-07-18 12:05:21.536275+02	2025-07-18 12:05:21.536295+02	18	id	documents/file_zJHlXrL.pdf	National Identification Card	f	19	\N
9	2025-07-18 12:26:13.993574+02	2025-07-18 12:26:13.993617+02	19	id	documents/file_YDgHoMK.pdf	National Identification Card	f	19	\N
11	2025-07-18 17:00:50.082204+02	2025-07-18 17:00:50.08222+02	21	id	documents/file_IJZPv2C.pdf	National Identification Card	f	19	\N
14	2025-07-21 10:30:18.907827+02	2025-07-21 10:30:18.907871+02	25	id	documents/file_DLdVDrd.pdf	National Identification Card	f	19	\N
15	2025-07-21 15:57:11.52696+02	2025-07-21 15:57:11.526979+02	26	id	documents/file_uPEYKZJ.pdf	National Identification Card	f	19	\N
16	2025-07-21 16:26:03.927623+02	2025-07-21 16:26:03.927643+02	27	id	documents/file_pFbDKCk.pdf	National Identification Card	f	19	\N
17	2025-07-22 09:36:58.490288+02	2025-07-22 09:36:58.490304+02	30	id	documents/file_RjouAu6.pdf	National Identification Card	f	19	\N
18	2025-07-22 09:42:05.603126+02	2025-07-22 09:42:05.603147+02	31	id	documents/file_8qzmlDm.pdf	National Identification Card	f	19	\N
19	2025-07-22 09:50:02.82803+02	2025-07-22 09:50:02.828046+02	32	id	documents/file_ltAPgiK.pdf	National Identification Card	f	19	\N
20	2025-07-22 10:19:17.307269+02	2025-07-22 10:19:17.307285+02	33	id	documents/file_PMpVosb.pdf	National Identification Card	f	19	\N
21	2025-07-22 10:27:05.903579+02	2025-07-22 10:27:05.903616+02	34	id	documents/file_FHCJUDF.pdf	National Identification Card	f	19	\N
22	2025-07-22 10:51:14.684617+02	2025-07-22 10:51:14.684645+02	35	id	documents/file_n4W7yWn.pdf	National Identification Card	f	19	\N
23	2025-07-22 11:05:09.29865+02	2025-07-22 11:05:09.298676+02	36	id	documents/file_7nADI6a.pdf	National Identification Card	f	19	\N
24	2025-07-22 14:41:58.15158+02	2025-07-22 14:41:58.151631+02	37	id	documents/file_l6S5ud1.pdf	National Identification Card	f	19	\N
\.


--
-- Data for Name: common_note; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.common_note (id, date_created, date_updated, object_id, content, is_private, author_id, content_type_id, user_id) FROM stdin;
1	2025-07-14 14:36:36.544663+02	2025-07-14 14:36:36.544678+02	3	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
2	2025-07-14 14:36:36.549134+02	2025-07-14 14:36:36.549157+02	3	Follow-up required on partnership proposal.	t	\N	19	\N
3	2025-07-14 14:37:59.886407+02	2025-07-14 14:37:59.886421+02	4	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
4	2025-07-14 14:37:59.889555+02	2025-07-14 14:37:59.88957+02	4	Follow-up required on partnership proposal.	t	\N	19	\N
5	2025-07-14 14:55:27.356132+02	2025-07-14 14:55:27.356199+02	5	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
6	2025-07-14 14:55:27.365205+02	2025-07-14 14:55:27.365235+02	5	Follow-up required on partnership proposal.	t	\N	19	\N
7	2025-07-14 15:16:56.402473+02	2025-07-14 15:16:56.402493+02	6	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
8	2025-07-14 15:16:56.406703+02	2025-07-14 15:16:56.406754+02	6	Follow-up required on partnership proposal.	t	\N	19	\N
11	2025-07-14 15:22:07.044604+02	2025-07-14 15:22:07.044647+02	8	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
12	2025-07-14 15:22:07.05105+02	2025-07-14 15:22:07.051094+02	8	Follow-up required on partnership proposal.	t	\N	19	\N
13	2025-07-15 11:50:51.269729+02	2025-07-15 11:50:51.269866+02	9	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
14	2025-07-15 11:54:55.66982+02	2025-07-15 11:54:55.669846+02	10	Initial contact made through industry event. Very promising lead.	f	\N	19	\N
15	2025-07-18 09:44:55.910075+02	2025-07-18 09:44:55.910105+02	10	Important note about this company	f	\N	21	\N
16	2025-07-18 09:50:56.937527+02	2025-07-18 09:50:56.937544+02	12	Important note about this company	f	\N	21	\N
17	2025-07-18 10:01:55.799018+02	2025-07-18 10:01:55.799038+02	14	Important note about this company	f	\N	21	\N
18	2025-07-18 10:16:22.884111+02	2025-07-18 10:16:22.884123+02	15	Important note about this company	f	\N	21	1
19	2025-07-18 10:44:41.510714+02	2025-07-18 10:44:41.510743+02	16	Important note about this company	f	\N	21	1
20	2025-07-18 11:30:05.77713+02	2025-07-18 11:30:05.777147+02	17	Important note about this company	f	\N	21	1
21	2025-07-18 11:54:52.566128+02	2025-07-18 11:54:52.56616+02	17	Important note about this Person	f	\N	19	\N
22	2025-07-18 12:05:21.540699+02	2025-07-18 12:05:21.540725+02	18	Important note about this Person	f	\N	19	\N
23	2025-07-18 12:26:14.001091+02	2025-07-18 12:26:14.001117+02	19	Important note about this Person	f	\N	19	\N
25	2025-07-18 17:00:50.093703+02	2025-07-18 17:00:50.093722+02	21	Important note about this Person	f	\N	19	\N
28	2025-07-21 10:30:18.92464+02	2025-07-21 10:30:18.924699+02	25	Important note about this Person	f	\N	19	\N
29	2025-07-21 15:57:11.53873+02	2025-07-21 15:57:11.53875+02	26	Important note about this Person	f	\N	19	\N
30	2025-07-21 16:26:03.930195+02	2025-07-21 16:26:03.930212+02	27	Important note about this Person	f	\N	19	\N
31	2025-07-22 09:36:58.51301+02	2025-07-22 09:36:58.513073+02	30	Important note about this Person	f	\N	19	\N
32	2025-07-22 09:42:05.608511+02	2025-07-22 09:42:05.608529+02	31	Important note about this Person	f	\N	19	\N
33	2025-07-22 09:50:02.835188+02	2025-07-22 09:50:02.835213+02	32	Important note about this Person	f	\N	19	\N
34	2025-07-22 10:19:17.317194+02	2025-07-22 10:19:17.31722+02	33	Important note about this Person	f	\N	19	\N
35	2025-07-22 10:27:05.916596+02	2025-07-22 10:27:05.916616+02	34	Important note about this Person	f	\N	19	\N
36	2025-07-22 10:51:14.698394+02	2025-07-22 10:51:14.698445+02	35	Important note about this Person	f	\N	19	\N
37	2025-07-22 11:05:09.348622+02	2025-07-22 11:05:09.348669+02	36	Important note about this Person	f	\N	19	\N
38	2025-07-22 11:08:02.065161+02	2025-07-22 11:08:02.06517+02	19	test	f	\N	21	1
39	2025-07-22 13:09:27.880334+02	2025-07-22 13:09:27.88034+02	23	makes brown beer	f	\N	21	1
40	2025-07-22 14:41:58.164454+02	2025-07-22 14:41:58.164487+02	37	Important note about this Person	f	\N	19	\N
\.


--
-- Data for Name: comms_hist_message; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.comms_hist_message (id, date_created, date_updated, client_object_id, message, origin, channel_path, client_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: comms_hist_reminder; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.comms_hist_reminder (id, date_created, date_updated, client_object_id, message, channel_path, action_date, message_sent, origin, client_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: communication; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.communication (id, date_created, date_updated, object_id, communication_type, direction, subject, content, sent_to, is_read, content_type_id, related_lease_id, sent_by_id, user_id) FROM stdin;
\.


--
-- Data for Name: communication_attachment; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.communication_attachment (id, date_created, date_updated, file, file_name, file_type, communication_id, user_id) FROM stdin;
\.


--
-- Data for Name: debt_cases; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.debt_cases (id, date_created, date_updated, status, opening_balance, current_balance, assigned_to_id, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: communication_logs; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.communication_logs (id, date_created, date_updated, communication_type, summary, details, follow_up_date, debt_case_id, user_id) FROM stdin;
\.


--
-- Data for Name: company_branch; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.company_branch (id, date_created, date_updated, branch_name, company_id, user_id, is_deleted, is_headquarters) FROM stdin;
1	2025-07-11 16:51:10.525962+02	2025-07-14 14:16:19.380244+02	Minimal Test	1	\N	t	f
2	2025-07-14 11:38:15.829837+02	2025-07-14 15:05:19.304742+02	Updated Branch Name	2	\N	t	f
3	2025-07-14 11:42:23.575265+02	2025-07-14 15:56:01.508726+02	Tech Solutions (Pty) Ltd 2	3	\N	t	f
6	2025-07-14 16:19:58.768828+02	2025-07-14 16:19:58.768843+02	New Branch 2	3	\N	f	f
4	2025-07-14 15:30:34.451448+02	2025-07-16 12:04:41.040201+02	New Branch1	3	\N	f	f
5	2025-07-14 15:49:12.927928+02	2025-07-16 13:16:03.239283+02	New Branch 22	3	\N	f	f
16	2025-07-17 12:31:06.88128+02	2025-07-17 12:31:06.881334+02	New Branch 20	3	\N	f	f
17	2025-07-17 12:34:02.058765+02	2025-07-17 12:34:02.058787+02	New Branch 00	3	\N	f	f
18	2025-07-17 15:55:29.841497+02	2025-07-17 15:55:29.841552+02	New Branch 03	3	\N	f	f
19	2025-07-18 09:44:55.924757+02	2025-07-18 09:44:55.924782+02	ABC Corporation	10	\N	f	t
20	2025-07-18 09:50:56.953067+02	2025-07-18 09:50:56.953087+02	ABC Corporation 2	12	\N	f	t
21	2025-07-18 09:52:07.75802+02	2025-07-18 09:52:07.75804+02	ABC Corp	13	\N	f	t
22	2025-07-18 10:01:55.812684+02	2025-07-18 10:01:55.812704+02	ABC Corporation 3	14	\N	f	t
23	2025-07-18 10:16:22.894898+02	2025-07-18 10:16:22.894917+02	ABC Corporation 4	15	\N	f	t
24	2025-07-18 10:37:08.282457+02	2025-07-18 10:37:08.282522+02	New Branch 05	3	\N	f	f
25	2025-07-18 10:38:44.392231+02	2025-07-18 10:38:44.392246+02	New Branch 07	3	\N	f	f
26	2025-07-18 10:44:41.537388+02	2025-07-18 10:44:41.53741+02	ABC Corporation 5	16	\N	f	t
27	2025-07-18 11:30:05.78713+02	2025-07-18 11:30:05.787147+02	ABC Corporation 6	17	\N	f	t
28	2025-07-22 11:08:02.084964+02	2025-07-22 11:08:02.084974+02	Fincheck PVT LTD	19	\N	f	t
29	2025-07-22 11:12:54.238259+02	2025-07-22 11:12:54.23827+02	lomagundi sales	20	\N	f	t
30	2025-07-22 11:23:21.059856+02	2025-07-22 11:23:21.059874+02	BP petroleum	21	\N	f	t
31	2025-07-22 11:28:16.30912+02	2025-07-22 11:28:16.30913+02	maize prod pvt ltd	22	\N	f	t
32	2025-07-22 13:09:27.898607+02	2025-07-22 13:09:27.898615+02	Castle Breweries Pvt Ltd	23	\N	f	t
\.


--
-- Data for Name: contact_person; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.contact_person (id, date_created, date_updated, contact_type, is_primary, "position", branch_id, individual_id, user_id) FROM stdin;
\.


--
-- Data for Name: company_profile; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.company_profile (date_created, date_updated, company_id, trading_status, mobile_phone, landline_phone, email, logo, registration_date, tin_number, vat_number, number_of_employees, website, trend, twitter, facebook, instagram, linkedin, operations, risk_class, account_number, is_under_judicial, is_suspended, contact_person_id, user_id) FROM stdin;
2025-07-14 11:38:15.859045+02	2025-07-14 11:38:15.859063+02	2	ACTIVE	+27123456789	+27111234567	info@techsol.co.za		\N	\N	4123456789	50	https://www.techsol.co.za	GROWING	\N	\N	\N	\N	Software development and IT consulting services	LOW	\N	NO_INFO	f	\N	\N
2025-07-14 11:42:23.609594+02	2025-07-14 11:42:23.609615+02	3	ACTIVE	+27123456789	+27111234567	info@techsol.co.za		\N	\N	4123456789	50	https://www.techsol.co.za	GROWING	\N	\N	\N	\N	Software development and IT consulting services	LOW	\N	NO_INFO	f	\N	\N
2025-07-18 09:44:55.912144+02	2025-07-18 09:44:55.912166+02	10	ACTIVE	\N	\N	info@abccorp.com		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	LOW	\N	NO_INFO	f	\N	\N
2025-07-18 09:50:56.941189+02	2025-07-18 09:50:56.941209+02	12	ACTIVE	+1234567890	+1234567890	info@abccorp.com		2020-01-01	BP12345	VAT12345	50	https://abccorp.com	GROWING	https://twitter.com/abccorp	https://facebook.com/abccorp	https://instagram.com/abccorp	https://linkedin.com/company/abccorp	Technology services provider	LOW	1234567890	NO	f	\N	\N
2025-07-18 09:52:07.751638+02	2025-07-18 09:52:07.75165+02	13	\N	\N	\N	info@abccorp.com		\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	LOW	\N	NO_INFO	f	\N	\N
2025-07-18 10:01:55.802+02	2025-07-18 10:01:55.802018+02	14	ACTIVE	+1234567890	+1234567890	info@abccorp.com		2020-01-01	BP12345	VAT12345	50	https://abccorp.com	GROWING	https://twitter.com/abccorp	https://facebook.com/abccorp	https://instagram.com/abccorp	https://linkedin.com/company/abccorp	Technology services provider	LOW	1234567890	NO	f	\N	\N
2025-07-18 10:16:22.886162+02	2025-07-18 10:16:22.88618+02	15	ACTIVE	+1234567890	+1234567890	info@abccorp.com		2020-01-01	BP12345	VAT12345	50	https://abccorp.com	GROWING	https://twitter.com/abccorp	https://facebook.com/abccorp	https://instagram.com/abccorp	https://linkedin.com/company/abccorp	Technology services provider	LOW	1234567890	NO	f	\N	1
2025-07-18 10:44:41.512741+02	2025-07-18 10:44:41.512755+02	16	ACTIVE	+1234567890	+1234567890	info@abccorp.com		2020-01-01	BP12345	VAT12345	50	https://abccorp.com	GROWING	https://twitter.com/abccorp	https://facebook.com/abccorp	https://instagram.com/abccorp	https://linkedin.com/company/abccorp	Technology services provider	LOW	1234567890	NO	f	\N	1
2025-07-18 11:30:05.779599+02	2025-07-18 11:30:05.779619+02	17	ACTIVE	+1234567890	+1234567890	info@abccorp.com		2020-01-01	BP12345	VAT12345	50	https://abccorp.com	GROWING	https://twitter.com/abccorp	https://facebook.com/abccorp	https://instagram.com/abccorp	https://linkedin.com/company/abccorp	Technology services provider	LOW	1234567890	NO	f	\N	1
2025-07-22 11:08:02.069429+02	2025-07-22 11:08:02.069438+02	19	\N	+263775668441		dudurussell@gmail.com		\N	1234567898	1234567899	\N	https://www.githum.com/russellgn	\N	https://chatgpt.com/tw	https://chatgpt.com/fb	https://chatgpt.com/in	https://chatgpt.com/li	sales, distribution	LOW	222	YES	t	\N	1
2025-07-22 11:12:54.222003+02	2025-07-22 11:12:54.222017+02	20	\N			loma@loma.co.zw		\N			\N		\N						LOW		NO_INFO	f	\N	1
2025-07-22 11:23:21.046754+02	2025-07-22 11:23:21.046762+02	21	\N			petroleum@bp.co.uk		\N			\N		\N						LOW		NO_INFO	f	\N	1
2025-07-22 11:28:16.295785+02	2025-07-22 11:28:16.295792+02	22	\N			maize@prod.com		\N			\N		\N						LOW		NO_INFO	f	\N	1
2025-07-22 13:09:27.885037+02	2025-07-22 13:09:27.885044+02	23	\N	+263779586059	0205239711	info@castlebreweries.co.zw		2025-04-02	T-2132	V-3242	\N	https://castlebreweries.co.zw	\N	https://x.com/castlebreweries	https://facebook.com/castlebreweries	https://instagram.com/castlebreweries/	https://linkedin.com/castlebreweries	manufacturing, sales, distribution	LOW	A-32132	NO_INFO	t	\N	1
\.


--
-- Data for Name: contact_detail; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.contact_detail (id, date_created, date_updated, email, mobile_phone, individual_id, user_id) FROM stdin;
5	2025-07-18 15:08:10.85375+02	2025-07-18 15:08:10.853841+02	doe@gmail.com	["+26777567897", "+26771234565"]	1	\N
6	2025-07-18 15:11:17.563512+02	2025-07-18 15:11:17.563534+02	doe@gmail.com	["+26777567897", "+26771234565"]	6	\N
7	2025-07-18 15:11:22.272275+02	2025-07-18 15:11:22.272288+02	doe@gmail.com	["+26777567897", "+26771234565"]	6	\N
8	2025-07-18 15:12:17.044213+02	2025-07-18 15:12:17.044261+02	doe@gmail.com	["+26777567897", "+26771234565", "+777"]	6	\N
9	2025-07-18 15:13:51.3049+02	2025-07-18 15:13:51.304919+02	doe@gmail.com	["+26777567897", "+26771234565", "+777"]	6	\N
10	2025-07-18 15:13:58.763137+02	2025-07-18 15:13:58.763156+02	doe@gmail.com	["+26777567897", "+26771234565", "+777"]	6	\N
18	2025-07-18 16:46:15.776641+02	2025-07-18 16:46:15.776659+02	doe@gmail.com	["+26777567897", "+26771234565", "+777", "+123", "000"]	7	\N
21	2025-07-18 16:50:45.366448+02	2025-07-18 16:50:45.366507+02	maluva@gmail.com	["+267775678907"]	20	\N
22	2025-07-18 17:00:50.073719+02	2025-07-18 17:00:50.073739+02	maluva@gmail.com	["+26777567897", "+26377123456"]	21	\N
24	2025-07-21 08:35:16.179123+02	2025-07-21 08:35:16.179151+02	maluva@gmail.com	["+26777567897", "+26377123456"]	22	\N
25	2025-07-21 08:55:50.576544+02	2025-07-21 08:55:50.57657+02	maluva@gmail.com	["+26777567897", "+26377123456"]	24	\N
26	2025-07-21 09:05:08.781412+02	2025-07-21 09:05:08.781434+02	doe@gmail.com	["+26777567897", "+26771234565", "+777", "+123", "000"]	24	\N
27	2025-07-21 09:05:47.736318+02	2025-07-21 09:05:47.736343+02	doe@gmail.com	["+26777567897", "+26771234565", "+777", "+123", "000"]	24	\N
28	2025-07-21 09:21:18.623063+02	2025-07-21 09:21:18.623134+02	\N	["+222"]	24	\N
29	2025-07-21 09:21:39.279711+02	2025-07-21 09:21:39.279749+02	\N	["+2223"]	24	\N
30	2025-07-21 09:26:44.972113+02	2025-07-21 09:26:44.972151+02	\N	["+2223"]	24	\N
31	2025-07-21 09:27:17.555909+02	2025-07-21 09:27:17.555939+02	\N	["+2223", "123"]	24	\N
32	2025-07-21 09:29:42.27637+02	2025-07-21 09:29:42.276418+02	\N	["+2223", "123", "88883"]	24	\N
33	2025-07-21 09:30:42.124074+02	2025-07-21 09:30:42.124098+02	\N	["88883"]	24	\N
34	2025-07-21 09:47:29.39832+02	2025-07-21 09:47:29.39834+02	\N	["88883"]	24	\N
35	2025-07-21 09:48:00.849391+02	2025-07-21 09:48:00.849409+02	\N	["88883", "1123"]	24	\N
36	2025-07-21 10:30:18.895635+02	2025-07-21 10:30:18.895651+02	sehmaluva@gmail.com	["+26777567897", "+26377123456"]	25	\N
37	2025-07-21 15:57:11.508434+02	2025-07-21 15:57:11.508457+02	maluva@gmail.com	["+26777567897", "+26377123456"]	26	\N
38	2025-07-21 16:26:03.912727+02	2025-07-21 16:26:03.912742+02	maluva@gmail.com	["+26777567897", "+26377123456"]	27	\N
39	2025-07-22 09:36:58.364731+02	2025-07-22 09:36:58.364746+02	\N	["6377056"]	30	\N
40	2025-07-22 09:42:05.582043+02	2025-07-22 09:42:05.582056+02	\N	["6377056"]	31	\N
41	2025-07-22 09:50:02.805367+02	2025-07-22 09:50:02.805387+02	\N	["637"]	32	\N
42	2025-07-22 10:19:17.288095+02	2025-07-22 10:19:17.28811+02	\N	["637", "6666"]	33	\N
43	2025-07-22 10:27:05.876381+02	2025-07-22 10:27:05.876407+02	maluva@gmail.com	["6376666"]	34	\N
44	2025-07-22 10:51:14.643364+02	2025-07-22 10:51:14.643418+02	maluva@gmail.com	["6376666"]	35	\N
45	2025-07-22 11:05:09.257169+02	2025-07-22 11:05:09.257208+02	maluva@gmail.com	["6376666"]	36	\N
46	2025-07-22 14:41:58.113778+02	2025-07-22 14:41:58.113808+02	maluva1@gmail.com	["00263779314332", "+263712452354"]	37	\N
47	2025-07-22 15:56:36.979099+02	2025-07-22 15:56:36.979128+02	maluva12@gmail.com	["+263777567897", "+263776234564"]	37	\N
\.


--
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.contract (id, date_created, date_updated, contract_type, title, reference_number, content, effective_date, expiration_date, status, party_a_object_id, party_b_object_id, party_a_content_type_id, party_b_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: contract_amendment; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.contract_amendment (id, date_created, date_updated, amendment_date, description, changes, contract_id, user_id) FROM stdin;
\.


--
-- Data for Name: debtor_intelligence_note; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.debtor_intelligence_note (id, date_created, date_updated, client_object_id, client_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
1	2025-07-11 14:27:17.182431+02	1	Seh Maluva (23123456F45)	1	[{"added": {}}]	19	1
2	2025-07-11 14:30:40.38683+02	1	Engineer at Fincheck	1	[{"added": {}}]	18	1
3	2025-07-11 14:42:49.941302+02	1	admin@admin.com	2	[{"changed": {"fields": ["Is verified"]}}]	8	1
4	2025-07-17 12:32:39.421848+02	15	New Branch 00 - Tech Solutions (Pty) Ltd 2	3		22	1
5	2025-07-17 12:32:39.429524+02	7	New Branch 01 - Tech Solutions (Pty) Ltd 2	3		22	1
6	2025-07-17 12:32:39.431317+02	9	New Branch 02 - Tech Solutions (Pty) Ltd 2	3		22	1
7	2025-07-17 12:32:39.4331+02	10	New Branch 03 - Tech Solutions (Pty) Ltd 2	3		22	1
8	2025-07-17 12:32:39.43533+02	11	New Branch 04 - Tech Solutions (Pty) Ltd 2	3		22	1
9	2025-07-17 12:32:39.439721+02	12	New Branch 05 - Tech Solutions (Pty) Ltd 2	3		22	1
10	2025-07-17 12:32:39.44258+02	14	New Branch 06 - Tech Solutions (Pty) Ltd 2	3		22	1
11	2025-07-19 15:04:44.375421+02	2	Optional Company Display Name (Company Profile User)	2	[{"changed": {"fields": ["Client object id"]}}]	69	1
12	2025-07-19 17:05:02.56628+02	11	John Doe (gtkandeya@gmail.com)	3		8	1
13	2025-07-19 17:07:54.933885+02	12	John Doe (gtkandeya@gmail.com)	3		8	1
14	2025-07-19 17:12:11.705432+02	13	John Doe (gtkandeya@gmail.com)	3		8	1
15	2025-07-19 17:21:38.337198+02	14	John Doe (gtkandeya@gmail.com)	2	[{"changed": {"name": "customuser-role relationship", "object": "CustomUser_roles object (12)", "fields": ["Role"]}}]	8	1
16	2025-07-19 17:28:51.909034+02	14	John Doe (gtkandeya@gmail.com)	3		8	1
\.


--
-- Data for Name: django_celery_beat_clockedschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_clockedschedule (id, clocked_time) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_crontabschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_crontabschedule (id, minute, hour, day_of_week, day_of_month, month_of_year, timezone) FROM stdin;
1	0	4	*	*	*	Africa/Harare
\.


--
-- Data for Name: django_celery_beat_intervalschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_intervalschedule (id, every, period) FROM stdin;
1	3600	seconds
\.


--
-- Data for Name: django_celery_beat_solarschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_solarschedule (id, event, latitude, longitude) FROM stdin;
\.


--
-- Data for Name: django_celery_beat_periodictask; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_periodictask (id, name, task, args, kwargs, queue, exchange, routing_key, expires, enabled, last_run_at, total_run_count, date_changed, description, crontab_id, interval_id, solar_id, one_off, start_time, priority, headers, clocked_id, expire_seconds) FROM stdin;
1	celery.backend_cleanup	celery.backend_cleanup	[]	{}	\N	\N	\N	\N	t	\N	0	2025-07-22 11:19:02.067403+02		1	\N	\N	f	\N	\N	{}	\N	43200
2	cleanup-expired-otps	apps.common.tasks.cleanup_expired_otps	[]	{}	\N	\N	\N	\N	t	\N	0	2025-07-22 11:19:02.108291+02		\N	1	\N	f	\N	\N	{}	\N	\N
\.


--
-- Data for Name: django_celery_beat_periodictasks; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_beat_periodictasks (ident, last_update) FROM stdin;
1	2025-07-22 11:19:02.109916+02
\.


--
-- Data for Name: django_celery_results_chordcounter; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_results_chordcounter (id, group_id, sub_tasks, count) FROM stdin;
\.


--
-- Data for Name: django_celery_results_groupresult; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_results_groupresult (id, group_id, date_created, date_done, content_type, content_encoding, result) FROM stdin;
\.


--
-- Data for Name: django_celery_results_taskresult; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_celery_results_taskresult (id, task_id, status, content_type, content_encoding, result, date_done, traceback, meta, task_args, task_kwargs, task_name, worker, date_created, periodic_task_name) FROM stdin;
1	9c012a14-e1f4-4a65-bfd7-c192dc3dbccc	FAILURE	application/json	utf-8	{"exc_type": "NotRegistered", "exc_message": ["apps.companies.services.tasks.create_company_branch_task"], "exc_module": "celery.exceptions"}	2025-07-17 11:23:21.263851+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:23:21.263799+02	\N
2	b6ec8cd7-d1d8-4412-a842-00e296b27c15	FAILURE	application/json	utf-8	{"exc_type": "KeyError", "exc_message": ["content_type"], "exc_module": "builtins"}	2025-07-17 11:35:02.66478+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:35:02.664731+02	\N
3	5de1416e-ac18-4df4-9a73-b2537828a4f5	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"3\\": \\"CompanyBranch.company\\" must be a \\"Company\\" instance."], "exc_module": "builtins"}	2025-07-17 11:37:37.928907+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:37:37.928847+02	\N
4	56de4c27-006a-45ff-b4d9-b2cb7c239c35	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"3\\": \\"CompanyBranch.company\\" must be a \\"Company\\" instance."], "exc_module": "builtins"}	2025-07-17 11:39:08.013817+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:39:08.013799+02	\N
5	e3f84b23-aada-4143-8d0e-bb1d83793122	FAILURE	application/json	utf-8	{"exc_type": "KeyError", "exc_message": ["company_id"], "exc_module": "builtins"}	2025-07-17 11:40:22.348456+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:40:22.348395+02	\N
6	3f8f4a06-5f81-45ad-a784-06a0dfabf67c	FAILURE	application/json	utf-8	{"exc_type": "TypeError", "exc_message": ["Direct assignment to the reverse side of a related set is prohibited. Use contacts.set() instead."], "exc_module": "builtins"}	2025-07-17 11:40:53.771715+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:40:53.771639+02	\N
7	83bc1bea-e82c-4909-b2e1-2a893cb637cc	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"3\\": \\"CompanyBranch.company\\" must be a \\"Company\\" instance."], "exc_module": "builtins"}	2025-07-17 11:42:55.275685+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:42:55.275629+02	\N
8	b9520951-d16f-46a5-9ae5-b70fb477e366	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"3\\": \\"CompanyBranch.company\\" must be a \\"Company\\" instance."], "exc_module": "builtins"}	2025-07-17 11:44:24.806332+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:44:24.806265+02	\N
9	308e0138-83ad-4d13-a445-4533fe86c780	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"3\\": \\"CompanyBranch.company\\" must be a \\"Company\\" instance."], "exc_module": "builtins"}	2025-07-17 11:46:12.966406+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:46:12.966343+02	\N
10	cc01aee6-65cc-4975-9445-e657c7ccbac3	FAILURE	application/json	utf-8	{"exc_type": "TypeError", "exc_message": ["Direct assignment to the reverse side of a related set is prohibited. Use contacts.set() instead."], "exc_module": "builtins"}	2025-07-17 11:47:19.694301+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:47:19.694238+02	\N
11	910fafb3-8c2e-46ac-8c5c-6bcc483ab92f	FAILURE	application/json	utf-8	{"exc_type": "TypeError", "exc_message": ["Direct assignment to the reverse side of a related set is prohibited. Use contacts.set() instead."], "exc_module": "builtins"}	2025-07-17 11:48:17.135665+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:48:17.135606+02	\N
12	ab68d6de-869b-4300-b5b8-dd52105f8ce7	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"4\\": \\"Address.city\\" must be a \\"City\\" instance."], "exc_module": "builtins"}	2025-07-17 11:56:10.245718+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:56:10.245701+02	\N
13	76a05052-1667-4d26-b100-46e8fa5fbbf8	FAILURE	application/json	utf-8	{"exc_type": "IntegrityError", "exc_message": ["duplicate key value violates unique constraint \\"unique_branch_name_per_company\\"\\nDETAIL:  Key (company_id, branch_name)=(3, New Branch 01) already exists.\\n"], "exc_module": "django.db.utils"}	2025-07-17 11:58:17.132997+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:58:17.132978+02	\N
14	2deb8557-303a-4c5a-b3cc-d9b4d2c257dc	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"4\\": \\"Address.city\\" must be a \\"City\\" instance."], "exc_module": "builtins"}	2025-07-17 11:58:49.805106+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:58:49.805085+02	\N
15	a616312f-53a3-46b4-838f-0dd14b3d8209	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"4\\": \\"Address.city\\" must be a \\"City\\" instance."], "exc_module": "builtins"}	2025-07-17 11:59:40.086894+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 11:59:40.086877+02	\N
16	6faa78a9-5d64-4198-b6ac-407c1c752c68	FAILURE	application/json	utf-8	{"exc_type": "ValueError", "exc_message": ["Cannot assign \\"4\\": \\"Address.city\\" must be a \\"City\\" instance."], "exc_module": "builtins"}	2025-07-17 12:18:38.166774+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:18:38.166757+02	\N
17	1b46288b-ceea-44ed-9a78-ef1c6d76d189	SUCCESS	application/json	utf-8	{"success": false, "error": "City with ID None not found."}	2025-07-17 12:21:19.42609+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:21:19.426072+02	\N
18	f6531a13-613b-4121-b56f-75b2f43101a4	FAILURE	application/json	utf-8	{"exc_type": "IntegrityError", "exc_message": ["duplicate key value violates unique constraint \\"unique_branch_name_per_company\\"\\nDETAIL:  Key (company_id, branch_name)=(3, New Branch 05) already exists.\\n"], "exc_module": "django.db.utils"}	2025-07-17 12:24:10.253684+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:24:10.253672+02	\N
19	2651b102-7fb6-4058-b089-39f9afdfda73	SUCCESS	application/json	utf-8	{"success": false, "error": "City with ID None not found."}	2025-07-17 12:25:13.705176+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:25:13.705159+02	\N
20	0eedcb76-4e49-48f4-8319-f2a830a7171c	SUCCESS	application/json	utf-8	{"success": false, "error": "Branch with name New Branch 06 already exists for this company."}	2025-07-17 12:25:59.624302+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:25:59.624244+02	\N
21	3e4deb0e-43b7-4867-9ba1-4c20922e0bce	FAILURE	application/json	utf-8	{"exc_type": "KeyError", "exc_message": ["city"], "exc_module": "builtins"}	2025-07-17 12:26:08.753701+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:26:08.753684+02	\N
22	9436fa9f-8f24-4c5e-9888-0ddf1fd912f5	SUCCESS	application/json	utf-8	{"success": false, "error": null}	2025-07-17 12:28:36.637359+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:28:36.637308+02	\N
23	e3c24fff-0ae5-4f37-ac45-9f2770cc9a8e	SUCCESS	application/json	utf-8	{"success": false, "error": {"branch_name": "New Branch 20"}}	2025-07-17 12:29:15.506743+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:29:15.506695+02	\N
24	166c552a-6934-4bea-9fa4-a9ffe4a238c5	FAILURE	application/json	utf-8	{"exc_type": "TypeError", "exc_message": ["list indices must be integers or slices, not str"], "exc_module": "builtins"}	2025-07-17 12:31:06.917049+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:31:06.91703+02	\N
25	0d7f5aed-68e2-445a-b717-ab867bc63904	SUCCESS	application/json	utf-8	{"success": false, "error": "Branch with name New Branch 20 already exists for this company."}	2025-07-17 12:33:34.533112+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:33:34.533053+02	\N
26	3acf916b-6bf8-4e8a-a1ca-896153bc68d7	SUCCESS	application/json	utf-8	{"success": true, "branch_id": 17, "branch_name": "New Branch 00"}	2025-07-17 12:34:02.132809+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 12:34:02.132792+02	\N
27	6297ac8b-f1c7-4c46-81c0-792eaf627322	SUCCESS	application/json	utf-8	{"success": true, "branch_id": 18, "branch_name": "New Branch 03"}	2025-07-17 15:55:29.924071+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-17 15:55:29.924054+02	\N
28	3be3b853-8837-4bff-812a-ff82fdabe1c5	SUCCESS	application/json	utf-8	{"success": true, "branch_id": 24, "branch_name": "New Branch 05"}	2025-07-18 10:37:08.333145+02	\N	{"children": []}	\N	\N	\N	\N	2025-07-18 10:37:08.333129+02	\N
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
tp3uap0ry67015mm3gg48ri46zw9vxgz	.eJxVjMsOwiAQRf-FtSG8CsSle7-BzAyDVA0kpV0Z_12bdKHbe865L5FgW2vaBi9pzuIstDj9bgj04LaDfId265J6W5cZ5a7Igw557Zmfl8P9O6gw6re2wUYoCl12UXlXijUGKBByVNoRUCFrsRBPIejJMUBA9OhZGw85F_H-APekOQ4:1udkXu:VpW8ISkeXIcKec5dP8D0dcNbpD6fTRaEO0cv3PQpoD0	2025-08-04 09:02:46.196807+02
80i419r59xmh6y0wwr0fush0r5x3jjbg	.eJxVjMsOwiAQRf-FtSHDlPJw6d5vINAZpGogKe3K-O_apAvd3nPOfYkQt7WErfMSZhJnocTpd0txenDdAd1jvTU5tbouc5K7Ig_a5bURPy-H-3dQYi_f2rIxE_mIigyMyWtQmH3SenCsPAxoswEavTPA5BwRIWpFVmdA7xjF-wPFXTby:1ue6zU:T9LqhacvsX1iSxU5cAFzlAOLNBrVTXYMCkVC-Vq-hss	2025-08-05 09:00:44.166058+02
\.


--
-- Data for Name: employment_detail; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.employment_detail (id, date_created, date_updated, employer_name, job_title, start_date, end_date, is_current, monthly_income, individual_id, user_id) FROM stdin;
1	2025-07-11 14:30:40.384741+02	2025-07-11 14:30:40.384756+02	Fincheck	Engineer	2025-01-01	\N	t	10.00	1	\N
2	2025-07-14 13:03:33.487974+02	2025-07-14 14:12:16.354216+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	2	\N
3	2025-07-14 14:36:36.555272+02	2025-07-14 14:36:36.555292+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	3	\N
4	2025-07-14 14:37:59.892204+02	2025-07-14 14:37:59.892218+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	4	\N
5	2025-07-14 14:55:27.369976+02	2025-07-14 14:55:27.370003+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	5	\N
6	2025-07-14 15:22:07.086042+02	2025-07-14 15:22:07.086081+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	8	\N
7	2025-07-15 11:50:51.315585+02	2025-07-15 11:50:51.315625+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	9	\N
8	2025-07-15 11:54:55.688403+02	2025-07-15 11:54:55.688426+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	10	\N
9	2025-07-15 14:29:21.427728+02	2025-07-15 14:29:21.427749+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	11	\N
10	2025-07-17 15:20:47.914065+02	2025-07-17 15:20:47.914128+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	12	\N
11	2025-07-17 15:21:36.013003+02	2025-07-17 15:21:36.013037+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	13	\N
12	2025-07-18 11:54:52.558554+02	2025-07-18 11:54:52.55857+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	17	\N
13	2025-07-18 12:05:21.527581+02	2025-07-18 12:05:21.527678+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	18	\N
14	2025-07-18 12:26:13.987214+02	2025-07-18 12:26:13.987232+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	\N	19	\N
18	2025-07-18 16:50:45.358436+02	2025-07-18 16:50:45.358458+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	20	\N
19	2025-07-18 17:00:50.076978+02	2025-07-18 17:00:50.076994+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	21	\N
21	2025-07-21 08:35:16.165704+02	2025-07-21 08:35:16.165756+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	22	\N
22	2025-07-21 08:55:50.580875+02	2025-07-21 08:55:50.581031+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	24	\N
23	2025-07-21 10:30:18.900637+02	2025-07-21 10:30:18.900653+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	25	\N
24	2025-07-21 15:57:11.51496+02	2025-07-21 15:57:11.514978+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	26	\N
25	2025-07-21 16:26:03.916141+02	2025-07-21 16:26:03.916154+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	27	\N
26	2025-07-22 09:36:58.430161+02	2025-07-22 09:36:58.430178+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	30	\N
27	2025-07-22 09:42:05.588183+02	2025-07-22 09:42:05.588199+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	31	\N
28	2025-07-22 09:50:02.811601+02	2025-07-22 09:50:02.811628+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	32	\N
29	2025-07-22 10:19:17.293178+02	2025-07-22 10:19:17.293194+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	33	\N
30	2025-07-22 10:27:05.884359+02	2025-07-22 10:27:05.884413+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	34	\N
31	2025-07-22 10:51:14.658532+02	2025-07-22 10:51:14.65859+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	35	\N
32	2025-07-22 11:05:09.273329+02	2025-07-22 11:05:09.273368+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	36	\N
33	2025-07-22 14:41:58.125931+02	2025-07-22 14:41:58.125976+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	37	\N
34	2025-07-22 15:56:36.97125+02	2025-07-22 15:56:36.971275+02	TechCorp Ltd.	Software Engineer	2020-01-10	\N	t	50.00	37	\N
\.


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.enquiries (id, date_created, date_updated, enquired_entity_object_id, enquired_entity_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: report_templates; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.report_templates (id, date_created, date_updated, name, report_type, description, template_file, is_active, user_id) FROM stdin;
\.


--
-- Data for Name: generated_reports; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.generated_reports (id, date_created, date_updated, parameters, generated_file, report_template_id, user_id) FROM stdin;
\.


--
-- Data for Name: lease_charge; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.lease_charge (id, date_created, date_updated, charge_type, description, amount, frequency, effective_date, end_date, is_active, currency_id, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: lease_log; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.lease_log (id, date_created, date_updated, log_type, "timestamp", details, object_id, content_type_id, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: lease_tenant; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.lease_tenant (id, date_created, date_updated, object_id, is_primary_tenant, content_type_id, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: lease_termination; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.lease_termination (id, date_created, date_updated, termination_date, reason, notes, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: legal_dispute; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.legal_dispute (id, date_created, date_updated, dispute_type, title, description, status, opened_date, closed_date, contract_id, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: maintenance_maintenancerequest; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.maintenance_maintenancerequest (id, date_created, date_updated, title, description, priority, status, requested_date, completed_date, assigned_to_id, lease_id, requested_by_id, user_id) FROM stdin;
\.


--
-- Data for Name: maintenance_maintenanceschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.maintenance_maintenanceschedule (id, date_created, date_updated, title, details, tradesman, contractor, required_materials, budget, responsible_person, reason, frequency, scheduled_day, month_frequency, tenant_landlord_contact, origin, status, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: maintenance_workschedule; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.maintenance_workschedule (id, date_created, date_updated, title, details, tradesman, contractor, required_materials, budget, responsible_person, reason, scheduled_date, tenant_landlord_contact, origin, status, lease_id, user_id) FROM stdin;
\.


--
-- Data for Name: next_of_kin; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.next_of_kin (id, date_created, date_updated, first_name, last_name, relationship, mobile_phone, email, physical_address, individual_id, user_id) FROM stdin;
1	2025-07-14 13:02:06.717668+02	2025-07-14 14:12:16.360966+02	Jane Doe		spouse		jane.doe@ipsum.com	45 Ipsum Village Internet	2	\N
2	2025-07-14 14:36:36.560435+02	2025-07-14 14:36:36.560481+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	3	\N
3	2025-07-14 14:37:59.895993+02	2025-07-14 14:37:59.89608+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	4	\N
4	2025-07-14 14:55:27.380118+02	2025-07-14 14:55:27.380183+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	5	\N
5	2025-07-14 15:22:07.099085+02	2025-07-14 15:22:07.09912+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	8	\N
6	2025-07-15 11:50:51.325638+02	2025-07-15 11:50:51.325764+02	Janes	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	9	\N
7	2025-07-15 11:54:55.693979+02	2025-07-15 11:54:55.694003+02	Janes	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	10	\N
8	2025-07-18 12:05:21.533639+02	2025-07-18 12:05:21.533662+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	18	\N
9	2025-07-18 12:26:13.989515+02	2025-07-18 12:26:13.989547+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	19	\N
13	2025-07-18 16:50:45.377591+02	2025-07-18 16:50:45.377609+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	20	\N
14	2025-07-18 17:00:50.079323+02	2025-07-18 17:00:50.079339+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	21	\N
16	2025-07-21 08:35:16.195557+02	2025-07-21 08:35:16.195601+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	22	\N
17	2025-07-21 08:55:50.588034+02	2025-07-21 08:55:50.588103+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	24	\N
18	2025-07-21 10:30:18.903788+02	2025-07-21 10:30:18.903811+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	25	\N
19	2025-07-21 15:57:11.520456+02	2025-07-21 15:57:11.520474+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	26	\N
20	2025-07-21 16:26:03.92222+02	2025-07-21 16:26:03.92224+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	27	\N
21	2025-07-22 09:36:58.465544+02	2025-07-22 09:36:58.465572+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	30	\N
22	2025-07-22 09:42:05.593243+02	2025-07-22 09:42:05.593267+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	31	\N
23	2025-07-22 09:50:02.821344+02	2025-07-22 09:50:02.821373+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	32	\N
24	2025-07-22 10:19:17.300778+02	2025-07-22 10:19:17.300911+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	33	\N
25	2025-07-22 10:27:05.894005+02	2025-07-22 10:27:05.894026+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	34	\N
26	2025-07-22 10:51:14.671981+02	2025-07-22 10:51:14.672003+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	35	\N
27	2025-07-22 11:05:09.282988+02	2025-07-22 11:05:09.283011+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	36	\N
28	2025-07-22 14:41:58.137246+02	2025-07-22 14:41:58.137551+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	37	\N
29	2025-07-22 15:56:36.994967+02	2025-07-22 15:56:36.994991+02	Jane	Doe	spouse	+263771112233	jane.doe@ipsum.com	45 Ipsum Village Internet	37	\N
\.


--
-- Data for Name: otp; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.otp (id, date_created, date_updated, otp_code, otp_type, requested_entity_object_id, requested_user_type, expire_at, is_used, requested_entity_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: payment_plans; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.payment_plans (id, date_created, date_updated, start_date, end_date, total_amount, installment_amount, frequency, status, debt_case_id, user_id) FROM stdin;
\.


--
-- Data for Name: reminder; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.reminder (id, date_created, date_updated, object_id, reminder_type, due_date, message, is_completed, completed_at, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: reporting_enquiry; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.reporting_enquiry (id, date_created, date_updated, enquired_entity_object_id, enquired_entity_content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: reporting_reporttemplate; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.reporting_reporttemplate (id, date_created, date_updated, name, report_type, description, template_file, is_active, user_id) FROM stdin;
\.


--
-- Data for Name: reporting_generatedreport; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.reporting_generatedreport (id, date_created, date_updated, parameters, generated_file, report_template_id, user_id) FROM stdin;
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.services (id, date_created, date_updated, service_name, user_id) FROM stdin;
\.


--
-- Data for Name: subscription_periods; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.subscription_periods (id, date_created, date_updated, name, code, period_length_days, period_length_months, user_id) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.subscriptions (id, date_created, date_updated, object_id, is_activated, start_date, end_date, subscription_class, total_slots, used_slots, total_amount, monthly_amount, content_type_id, currency_id, payment_method_id, period_id, service_id, user_id) FROM stdin;
\.


--
-- Data for Name: subscriptions_services; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.subscriptions_services (id, date_created, date_updated, service_name, user_id) FROM stdin;
\.


--
-- Data for Name: subscriptions_subscriptionperiod; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.subscriptions_subscriptionperiod (id, date_created, date_updated, name, code, period_length_days, period_length_months, user_id) FROM stdin;
\.


--
-- Data for Name: users_customuser_groups; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_customuser_groups (id, customuser_id, group_id) FROM stdin;
\.


--
-- Data for Name: users_role; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_role (id, date_created, date_updated, name, description, is_active, user_id) FROM stdin;
1	\N	\N	Admin	Full administrative access to the entire system.	t	\N
2	\N	\N	Superintendent	Oversees building operations and maintenance, often with limited system access.	t	\N
3	\N	\N	Accountant	Manages all financial aspects, including invoices, payments, bank reconciliations, and financial reports.	t	\N
4	\N	\N	Property Manager	Oversees property operations, including leases, tenants, maintenance, and basic financials.	t	\N
5	\N	\N	Lease Administrator	Specializes in lease agreements, renewals, and tenant applications.	t	\N
6	\N	\N	Maintenance Coordinator	Manages maintenance requests, assigns tasks to vendors, and tracks progress.	t	\N
7	\N	\N	Tenant	For system users who are tenants. Can view their own property/lease details, make payments, and submit maintenance requests.	t	\N
8	\N	\N	Agent	Manages property listings, interacts with prospective tenants, and handles leads.	t	\N
9	\N	\N	Analytics Manager	Has comprehensive access to all data for reporting and analytical purposes.	t	\N
10	\N	\N	Executive	High-level oversight; typically view-only access to all critical business data and reports.	t	\N
11	\N	\N	Vendor	Limited access for service vendors to view assigned maintenance tasks and update status.	t	\N
12	\N	\N	Landlord	Allows property owners to view their property details, financial statements, and tenant information.	t	\N
13	\N	\N	Read-Only User	Can view most non-sensitive data but cannot make any changes.	t	\N
\.


--
-- Data for Name: users_customuser_roles; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_customuser_roles (id, customuser_id, role_id) FROM stdin;
13	15	2
\.


--
-- Data for Name: users_customuser_user_permissions; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_customuser_user_permissions (id, customuser_id, permission_id) FROM stdin;
\.


--
-- Data for Name: users_role_permissions; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_role_permissions (id, role_id, permission_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	1	21
22	1	22
23	1	23
24	1	24
25	1	25
26	1	26
27	1	27
28	1	28
29	1	29
30	1	30
31	1	31
32	1	32
33	1	33
34	1	34
35	1	35
36	1	36
37	1	37
38	1	38
39	1	39
40	1	40
41	1	41
42	1	42
43	1	43
44	1	44
45	1	45
46	1	46
47	1	47
48	1	48
49	1	49
50	1	50
51	1	51
52	1	52
53	1	53
54	1	54
55	1	55
56	1	56
57	1	57
58	1	58
59	1	59
60	1	60
61	1	61
62	1	62
63	1	63
64	1	64
65	1	65
66	1	66
67	1	67
68	1	68
69	1	69
70	1	70
71	1	71
72	1	72
73	1	73
74	1	74
75	1	75
76	1	76
77	1	77
78	1	78
79	1	79
80	1	80
81	1	81
82	1	82
83	1	83
84	1	84
85	1	85
86	1	86
87	1	87
88	1	88
89	1	89
90	1	90
91	1	91
92	1	92
93	1	93
94	1	94
95	1	95
96	1	96
97	1	97
98	1	98
99	1	99
100	1	100
101	1	101
102	1	102
103	1	103
104	1	104
105	1	105
106	1	106
107	1	107
108	1	108
109	1	109
110	1	110
111	1	111
112	1	112
113	1	113
114	1	114
115	1	115
116	1	116
117	1	117
118	1	118
119	1	119
120	1	120
121	1	121
122	1	122
123	1	123
124	1	124
125	1	125
126	1	126
127	1	127
128	1	128
129	1	129
130	1	130
131	1	131
132	1	132
133	1	133
134	1	134
135	1	135
136	1	136
137	1	137
138	1	138
139	1	139
140	1	140
141	1	141
142	1	142
143	1	143
144	1	144
145	1	145
146	1	146
147	1	147
148	1	148
149	1	149
150	1	150
151	1	151
152	1	152
153	1	153
154	1	154
155	1	155
156	1	156
157	1	157
158	1	158
159	1	159
160	1	160
161	1	161
162	1	162
163	1	163
164	1	164
165	1	165
166	1	166
167	1	167
168	1	168
169	1	169
170	1	170
171	1	171
172	1	172
173	1	173
174	1	174
175	1	175
176	1	176
177	1	177
178	1	178
179	1	179
180	1	180
181	1	181
182	1	182
183	1	183
184	1	184
185	1	185
186	1	186
187	1	187
188	1	188
189	1	189
190	1	190
191	1	191
192	1	192
193	1	193
194	1	194
195	1	195
196	1	196
197	1	197
198	1	198
199	1	199
200	1	200
201	1	201
202	1	202
203	1	203
204	1	204
205	1	205
206	1	206
207	1	207
208	1	208
209	1	209
210	1	210
211	1	211
212	1	212
213	1	213
214	1	214
215	1	215
216	1	216
217	1	217
218	1	218
219	1	219
220	1	220
221	1	221
222	1	222
223	1	223
224	1	224
225	1	225
226	1	226
227	1	227
228	1	228
229	1	229
230	1	230
231	1	231
232	1	232
233	1	233
234	1	234
235	1	235
236	1	236
237	1	237
238	1	238
239	1	239
240	1	240
241	1	241
242	1	242
243	1	243
244	1	244
245	1	245
246	1	246
247	1	247
248	1	248
249	1	249
250	1	250
251	1	251
252	1	252
253	1	253
254	1	254
255	1	255
256	1	256
257	1	257
258	1	258
259	1	259
260	1	260
261	1	261
262	1	262
263	1	263
264	1	264
265	1	265
266	1	266
267	1	267
268	1	268
269	1	269
270	1	270
271	1	271
272	1	272
273	1	273
274	1	274
275	1	275
276	1	276
277	1	277
278	1	278
279	1	279
280	1	280
281	1	281
282	1	282
283	1	283
284	1	284
285	1	285
286	1	286
287	1	287
288	1	288
289	1	289
290	1	290
291	1	291
292	1	292
293	1	293
294	1	294
295	1	295
296	1	296
297	1	297
298	1	298
299	1	299
300	1	300
301	1	301
302	1	302
303	1	303
304	1	304
305	1	305
306	1	306
307	1	307
308	1	308
309	1	309
310	1	310
311	1	311
312	1	312
313	1	313
314	1	314
315	1	315
316	1	316
317	1	317
318	1	318
319	1	319
320	1	320
321	1	321
322	1	322
323	1	323
324	1	324
325	1	325
326	1	326
327	1	327
328	1	328
329	1	329
330	1	330
331	1	331
332	1	332
333	1	333
334	1	334
335	1	335
336	1	336
337	1	337
338	1	338
339	1	339
340	1	340
341	1	341
342	1	342
343	1	343
344	1	344
345	1	345
346	1	346
347	1	347
348	1	348
349	1	349
350	1	350
351	1	351
352	1	352
353	2	225
354	2	226
355	2	100
356	2	228
357	2	108
358	3	76
359	3	84
360	3	120
361	3	137
362	3	138
363	3	139
364	3	140
365	3	141
366	3	142
367	3	143
368	3	144
369	3	145
370	3	146
371	3	147
372	3	148
373	3	149
374	3	150
375	3	151
376	3	152
377	3	153
378	3	154
379	3	155
380	3	156
381	3	157
382	3	158
383	3	159
384	3	160
385	3	161
386	3	162
387	3	163
388	3	164
389	3	165
390	3	166
391	3	167
392	3	168
393	3	169
394	3	170
395	3	171
396	3	172
397	3	173
398	3	174
399	3	175
400	3	176
401	3	177
402	3	178
403	3	179
404	3	180
405	3	181
406	3	182
407	3	183
408	3	184
409	3	185
410	3	186
411	3	187
412	3	188
413	3	189
414	3	190
415	3	191
416	3	192
417	3	193
418	3	194
419	3	195
420	3	196
421	3	197
422	3	198
423	3	199
424	3	200
425	3	201
426	3	202
427	3	203
428	3	204
429	3	205
430	3	206
431	3	207
432	3	208
433	3	209
434	3	210
435	3	211
436	3	212
437	4	144
438	4	148
439	4	149
440	4	150
441	4	152
442	4	156
443	4	32
444	4	169
445	4	170
446	4	172
447	4	181
448	4	182
449	4	184
450	4	188
451	4	73
452	4	74
453	4	75
454	4	76
455	4	204
456	4	81
457	4	82
458	4	83
459	4	84
460	4	97
461	4	98
462	4	99
463	4	100
464	4	225
465	4	226
466	4	227
467	4	228
468	4	105
469	4	106
470	4	107
471	4	108
472	4	117
473	4	118
474	4	119
475	4	120
476	5	100
477	5	73
478	5	74
479	5	76
480	5	108
481	5	172
482	5	117
483	5	118
484	5	119
485	5	120
486	5	184
487	6	225
488	6	226
489	6	227
490	6	100
491	6	228
492	6	108
493	6	76
494	6	172
495	6	84
496	6	184
497	7	32
498	7	225
499	7	100
500	7	228
501	7	172
502	7	181
503	7	30
504	7	120
505	7	184
506	8	100
507	8	200
508	8	73
509	8	74
510	8	108
511	8	76
512	9	192
513	9	200
514	9	204
515	9	76
516	9	144
517	9	148
518	9	212
519	9	84
520	9	152
521	9	156
522	9	120
523	9	160
524	9	32
525	9	164
526	9	100
527	9	228
528	9	172
529	9	108
530	9	176
531	9	184
532	9	188
533	10	200
534	10	204
535	10	76
536	10	144
537	10	148
538	10	84
539	10	152
540	10	156
541	10	184
542	10	160
543	10	32
544	10	100
545	10	228
546	10	108
547	10	172
548	10	176
549	10	120
550	11	184
551	11	226
552	11	172
553	11	228
554	12	100
555	12	228
556	12	108
557	12	76
558	12	172
559	12	176
560	12	120
561	12	156
562	12	152
563	12	184
564	13	192
565	13	200
566	13	76
567	13	204
568	13	144
569	13	148
570	13	84
571	13	212
572	13	152
573	13	156
574	13	120
575	13	160
576	13	32
577	13	164
578	13	100
579	13	228
580	13	172
581	13	108
582	13	176
583	13	184
584	13	188
\.


--
-- Data for Name: users_usersetting; Type: TABLE DATA; Schema: public; Owner: new_rentsafe
--

COPY public.users_usersetting (id, date_created, date_updated, dark_mode_enabled, email_notifications_enabled, extra_preferences, preferred_currency_id, user_id) FROM stdin;
\.


--
-- Name: accounting_accountsector_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_accountsector_id_seq', 1, false);


--
-- Name: accounting_cashbook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_cashbook_id_seq', 1, false);


--
-- Name: accounting_cashbookentry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_cashbookentry_id_seq', 1, false);


--
-- Name: accounting_cashsale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_cashsale_id_seq', 1, false);


--
-- Name: accounting_creditnote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_creditnote_id_seq', 1, false);


--
-- Name: accounting_currency_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_currency_id_seq', 5, true);


--
-- Name: accounting_currencyrate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_currencyrate_id_seq', 1, false);


--
-- Name: accounting_generalledgeraccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_generalledgeraccount_id_seq', 1, false);


--
-- Name: accounting_invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_invoice_id_seq', 1, false);


--
-- Name: accounting_journalentry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_journalentry_id_seq', 1, false);


--
-- Name: accounting_ledgertransaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_ledgertransaction_id_seq', 1, false);


--
-- Name: accounting_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_payment_id_seq', 1, false);


--
-- Name: accounting_paymentmethod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_paymentmethod_id_seq', 7, true);


--
-- Name: accounting_salesaccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_salesaccount_id_seq', 1, false);


--
-- Name: accounting_salescategory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_salescategory_id_seq', 1, false);


--
-- Name: accounting_salesitem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_salesitem_id_seq', 1, false);


--
-- Name: accounting_transactionlineitem_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_transactionlineitem_id_seq', 1, false);


--
-- Name: accounting_transactiontype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_transactiontype_id_seq', 1, false);


--
-- Name: accounting_vatsetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.accounting_vatsetting_id_seq', 1, false);


--
-- Name: active_credit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.active_credit_id_seq', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 352, true);


--
-- Name: claim_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.claim_id_seq', 1, false);


--
-- Name: client_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.client_id_seq', 2, true);


--
-- Name: common_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_address_id_seq', 73, true);


--
-- Name: common_city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_city_id_seq', 183, true);


--
-- Name: common_country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_country_id_seq', 10, true);


--
-- Name: common_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_document_id_seq', 24, true);


--
-- Name: common_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_note_id_seq', 40, true);


--
-- Name: common_province_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_province_id_seq', 25, true);


--
-- Name: common_suburb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.common_suburb_id_seq', 531, true);


--
-- Name: comms_hist_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.comms_hist_message_id_seq', 1, false);


--
-- Name: comms_hist_reminder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.comms_hist_reminder_id_seq', 1, false);


--
-- Name: communication_attachment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.communication_attachment_id_seq', 1, false);


--
-- Name: communication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.communication_id_seq', 1, false);


--
-- Name: communication_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.communication_logs_id_seq', 1, false);


--
-- Name: company_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.company_branch_id_seq', 32, true);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.company_id_seq', 23, true);


--
-- Name: contact_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.contact_detail_id_seq', 47, true);


--
-- Name: contact_person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.contact_person_id_seq', 1, false);


--
-- Name: contract_amendment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.contract_amendment_id_seq', 1, false);


--
-- Name: contract_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.contract_id_seq', 1, false);


--
-- Name: debt_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.debt_cases_id_seq', 1, false);


--
-- Name: debtor_intelligence_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.debtor_intelligence_note_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 16, true);


--
-- Name: django_celery_beat_clockedschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_beat_clockedschedule_id_seq', 1, false);


--
-- Name: django_celery_beat_crontabschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_beat_crontabschedule_id_seq', 1, true);


--
-- Name: django_celery_beat_intervalschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_beat_intervalschedule_id_seq', 1, true);


--
-- Name: django_celery_beat_periodictask_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_beat_periodictask_id_seq', 2, true);


--
-- Name: django_celery_beat_solarschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_beat_solarschedule_id_seq', 1, false);


--
-- Name: django_celery_results_chordcounter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_results_chordcounter_id_seq', 1, false);


--
-- Name: django_celery_results_groupresult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_results_groupresult_id_seq', 1, false);


--
-- Name: django_celery_results_taskresult_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_celery_results_taskresult_id_seq', 28, true);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 88, true);


--
-- Name: employment_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.employment_detail_id_seq', 34, true);


--
-- Name: enquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.enquiries_id_seq', 1, false);


--
-- Name: generated_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.generated_reports_id_seq', 1, false);


--
-- Name: guarantor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.guarantor_id_seq', 1, false);


--
-- Name: individual_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.individual_id_seq', 37, true);


--
-- Name: lease_charge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.lease_charge_id_seq', 1, false);


--
-- Name: lease_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.lease_log_id_seq', 1, false);


--
-- Name: lease_tenant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.lease_tenant_id_seq', 1, false);


--
-- Name: lease_termination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.lease_termination_id_seq', 1, false);


--
-- Name: leases_lease_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.leases_lease_id_seq', 1, false);


--
-- Name: legal_dispute_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.legal_dispute_id_seq', 1, false);


--
-- Name: maintenance_maintenancerequest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.maintenance_maintenancerequest_id_seq', 1, false);


--
-- Name: maintenance_maintenanceschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.maintenance_maintenanceschedule_id_seq', 1, false);


--
-- Name: maintenance_workschedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.maintenance_workschedule_id_seq', 1, false);


--
-- Name: next_of_kin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.next_of_kin_id_seq', 29, true);


--
-- Name: otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.otp_id_seq', 1, false);


--
-- Name: payment_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.payment_plans_id_seq', 1, false);


--
-- Name: properties_property_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.properties_property_id_seq', 1, false);


--
-- Name: properties_propertytype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.properties_propertytype_id_seq', 1, false);


--
-- Name: properties_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.properties_unit_id_seq', 1, false);


--
-- Name: reminder_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.reminder_id_seq', 1, false);


--
-- Name: report_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.report_templates_id_seq', 1, false);


--
-- Name: reporting_enquiry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.reporting_enquiry_id_seq', 1, false);


--
-- Name: reporting_generatedreport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.reporting_generatedreport_id_seq', 1, false);


--
-- Name: reporting_reporttemplate_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.reporting_reporttemplate_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.services_id_seq', 1, false);


--
-- Name: subscription_periods_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.subscription_periods_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: subscriptions_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.subscriptions_services_id_seq', 1, false);


--
-- Name: subscriptions_subscriptionperiod_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.subscriptions_subscriptionperiod_id_seq', 1, false);


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_customuser_groups_id_seq', 1, false);


--
-- Name: users_customuser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_customuser_id_seq', 15, true);


--
-- Name: users_customuser_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_customuser_roles_id_seq', 13, true);


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_customuser_user_permissions_id_seq', 1, false);


--
-- Name: users_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_role_id_seq', 13, true);


--
-- Name: users_role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_role_permissions_id_seq', 584, true);


--
-- Name: users_usersetting_id_seq; Type: SEQUENCE SET; Schema: public; Owner: new_rentsafe
--

SELECT pg_catalog.setval('public.users_usersetting_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

