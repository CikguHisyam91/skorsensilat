/* Pangkalan data tiruan untuk DEMO sahaja (meniru Firebase + Rules) */
(function(){
  const KEY='fbmock2';
  const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}};
  const save=t=>{try{localStorage.setItem(KEY,JSON.stringify(t))}catch(e){}};
  const parts=p=>p.split('/').filter(Boolean);
  const getP=(t,p)=>{let o=t;for(const k of parts(p)){if(o==null||typeof o!=='object')return null;o=o[k];}return o===undefined?null:o;};
  const clean=o=>{if(o&&typeof o==='object'){for(const k of Object.keys(o)){o[k]=clean(o[k]);if(o[k]==null)delete o[k];}return Object.keys(o).length?o:null;}return o;};
  const setP=(t,p,v)=>{const ks=parts(p);let o=t;for(let i=0;i<ks.length-1;i++){if(!o[ks[i]]||typeof o[ks[i]]!=='object')o[ks[i]]={};o=o[ks[i]];}
    const last=ks[ks.length-1];if(v==null)delete o[last];else o[last]=JSON.parse(JSON.stringify(v));};
  let UID;try{const k='uid_'+(window.name||'x');UID=sessionStorage.getItem(k);if(!UID){UID='u'+Math.random().toString(36).slice(2,9);sessionStorage.setItem(k,UID);}}catch(e){UID='u'+Math.random().toString(36).slice(2,9);}
  const DENY=()=>{throw new Error('PERMISSION_DENIED')};
  function semak(t,p,v){
    const k=parts(p);
    if(k[0]==='sedia'){if(getP(t,'sedia'))DENY();return;}
    if(k[0]==='rahsia'){if(getP(t,'rahsia')&&getP(t,'sesi/kp')!==UID)DENY();return;}
    if(k[0]==='login'){if(k[2]!==UID||String(v)!==String(getP(t,'rahsia/'+k[1])))DENY();return;}
    if(k[0]==='sesi'){if(v===UID){if(String(getP(t,'login/'+k[1]+'/'+UID))!==String(getP(t,'rahsia/'+k[1])))DENY();}else if(!(v==null&&getP(t,p)===UID))DENY();return;}
    if(k[0]==='pub'){
      if(k[1]==='meta'){if(getP(t,'sesi/kp')!==UID)DENY();return;}
      if(k[1]==='kat'&&k[2]){
        const sah=getP(t,'pub/kat/'+k[2]+'/sah');
        if(k[3]==='markah'&&k[5]&&getP(t,'sesi/juri'+k[5])===UID){if(sah)DENY();return;}
        if(getP(t,'sesi/kp')!==UID||(sah&&!(v==null&&k.length===3)))DENY();return;}
    }
    DENY();
  }
  const subs=[];
  function notify(){const t=load();subs.forEach(s=>{const j=JSON.stringify(getP(t,s.p));if(j!==s.last){s.last=j;s.cb(JSON.parse(j));}});}
  window.addEventListener('storage',e=>{if(e.key===KEY)notify();});
  const tunda=()=>new Promise(r=>setTimeout(r,40));
  window.MOCK_DB={
    init:async()=>UID,
    on:(p,cb)=>{const s={p,cb,last:null};subs.push(s);setTimeout(()=>{const j=JSON.stringify(getP(load(),p));s.last=j;cb(JSON.parse(j));},0);return()=>{const i=subs.indexOf(s);if(i>=0)subs.splice(i,1);};},
    get:async p=>{await tunda();const t=load();const k=parts(p);if(k[0]==='rahsia'&&getP(t,'sesi/kp')!==UID)DENY();return getP(t,p);},
    set:async(p,v)=>{await tunda();const t=load();semak(t,p,v);setP(t,p,v);save(clean(t)||{});notify();},
    update:async(p,o)=>{await tunda();const t=load();for(const k in o)semak(t,p+'/'+k,o[k]);for(const k in o)setP(t,p+'/'+k,o[k]);save(clean(t)||{});notify();},
    remove:async p=>{await tunda();const t=load();semak(t,p,null);setP(t,p,null);save(clean(t)||{});notify();},
    connected:cb=>setTimeout(()=>cb(true),0)
  };
  window.confirm=()=>true;
  window.print=()=>{const t=document.getElementById('toast');if(t){t.textContent='Demo: cetakan berfungsi dalam sistem sebenar.';t.style.display='block';t.style.color='var(--warn)';setTimeout(()=>t.style.display='none',3500);}};
  /* PIN auto untuk demo (boleh KELUAR untuk lihat skrin PIN) */
  const q=new URLSearchParams(location.search);
  if(q.get('auto')==='1')window.DEMO_PIN={kp:'1234',juri1:'1111',juri2:'2222',juri3:'3333'};
  /* Data contoh */
  if(!localStorage.getItem(KEY)){
    const P={p1:{undian:'1',nama:"'Abdul Rahman bin Ali",pasukan:'SMK Bukit Baru'},p2:{undian:'2',nama:"Siti Nur'Aisyah binti Kamal",pasukan:'SMK Ayer Keroh'},p3:{undian:'3',nama:'Muhammad Haziq',pasukan:'SMK Alor Gajah'},p4:{undian:'4',nama:'Lim Wei Jie',pasukan:'SMK Tinggi Melaka'},p5:{undian:'5',nama:'Nurul Izzah',pasukan:'SMK Jasin'},p6:{undian:'6',nama:'Arif Danial',pasukan:'SMK Merlimau'}};
    const full=(ov)=>{const v={a1:12,a2:6,a3:6,a4:6,a5:6,b1:3,b2:3,c1:6,c2:6,c3:1,c4:3,c5:1,c6:1};return Object.assign(v,ov);};
    save({sedia:true,rahsia:{kp:'1234',juri1:'1111',juri2:'2222',juri3:'3333',juri4:'4444',juri5:'5555'},
      pub:{meta:{kejohanan:'KEJOHANAN SILAT SENI SEKOLAH-SEKOLAH (DEMO)',aktif:'k5',senarai:{k5:{nama:'TUNGGAL REMAJA PUTRA',jenis:'PT',acara:'REMAJA PUTRA',t:5},k4:{nama:'REGU PUTRA',jenis:'PR',acara:'DEWASA (SUKMA) PUTRA',t:4},k3:{nama:'GANDA PUTRI',jenis:'PG',acara:'REMAJA PUTRI',t:3},k1:{nama:'SENI TARI SILAT PUTERA',jenis:'I',acara:'LSM',t:1},k6:{nama:'SENI TEMPUR SILAT PUTERA',jenis:'II',acara:'LSM',t:1.1},k7:{nama:'SENI SILAT ASLI PUTERI',jenis:'III',acara:'PSM',t:1.2},k8:{nama:'SENI JURUS SILAT PUTERA',jenis:'IV',acara:'LSR',t:1.3},k2:{nama:'SOLO KREATIF PUTRA',jenis:'PS',acara:'REMAJA PUTRA',t:2}}},
        kat:{k5:{nama:'TUNGGAL REMAJA PUTRA',jenis:'PT',acara:'REMAJA PUTRA',bilJuri:3,kaedah:'median',skala10:true,paparMarkah:true,semasa:'t2',
          masa:{sasaran:180,toleransi:0,tolakLebih:true,tier:[{dari:6,hingga:10,tolak:10},{dari:11,hingga:15,tolak:15},{dari:16,hingga:9999,tolak:20}]},
          peserta:{t1:{undian:'1',nama:'Muhammad Adam Haikal',pasukan:'Perguruan Seni Gayong'},t2:{undian:'2',nama:"Ahmad 'Ammar Zikri",pasukan:'Silat Kalimah'},t3:{undian:'3',nama:'Irfan Hakimi',pasukan:'Silat Lincah Malaysia'},t4:{undian:'4',nama:'Khairul Anuar',pasukan:'Persatuan Cekak Hanafi'}},
          rekodMasa:{t1:177,t2:175},tolak:{},
          markah:{t1:{1:{v:{j4:1,j9:1,b:56},t:1},2:{v:{j9:2,b:55},t:1},3:{v:{j4:1,b:57},t:1}},
                  t2:{1:{v:{j2:1,b:54},t:1},2:{v:{},dq:{sebab:'3 kesalahan jurus berturut-turut — Jurus 5–7',t:1},t:1},3:{v:{j6:1},dq:{sebab:'Salah arah — Jurus 6',t:1},t:1}}}},
          k4:{nama:'REGU PUTRA',jenis:'PR',acara:'DEWASA (SUKMA) PUTRA',bilJuri:3,kaedah:'median',skala10:true,paparMarkah:true,semasa:'r3',
          masa:{sasaran:180,toleransi:0,tolakLebih:true,tier:[{dari:6,hingga:10,tolak:10},{dari:11,hingga:15,tolak:15},{dari:16,hingga:9999,tolak:20}]},
          peserta:{r1:{undian:'1',nama:'Haziq, Amsyar & Irfan',pasukan:'Perguruan Seni Gayong'},r2:{undian:'2',nama:"Syafiq, Danial & 'Aqil",pasukan:'Persatuan Cekak Hanafi'},r3:{undian:'3',nama:'Luqman, Firdaus & Harith',pasukan:'Silat Lincah Malaysia'}},
          rekodMasa:{r1:184,r2:189},tolak:{r2:{garis:1}},
          markah:{r1:{1:{v:{j3:1,j8:2,b:56},t:1},2:{v:{j3:1,j8:1,j11:1,b:55},t:1},3:{v:{j8:2,b:57},t:1}},
                  r2:{1:{v:{j1:1,b:58},t:1},2:{v:{b:57},t:1},3:{v:{j5:1,j12:1,b:58},t:1,c:'Jurus 12 urutan terbalik'}}}},
          k3:{nama:'GANDA PUTRI',jenis:'PG',acara:'REMAJA PUTRI',bilJuri:3,kaedah:'median',skala10:true,paparMarkah:true,semasa:'g3',
          masa:{sasaran:180,toleransi:0,tolakLebih:true,tier:[{dari:15,hingga:30,tolak:5},{dari:31,hingga:60,tolak:10},{dari:61,hingga:9999,tolak:10}]},
          peserta:{g1:{undian:'1',nama:"Nur Aina & Siti Hajar",pasukan:'Perguruan Seni Gayong'},g2:{undian:'2',nama:"Nurul 'Ain & Farah Izzati",pasukan:'Persatuan Cekak Hanafi'},g3:{undian:'3',nama:'Aisyah Humaira & Damia Qistina',pasukan:'Silat Lincah Malaysia'},g4:{undian:'4',nama:'Alya Natasha & Sofea Imani',pasukan:'Silat Kalimah'}},
          rekodMasa:{g1:181,g2:176},tolak:{g2:{senjata:1}},
          markah:{g1:{1:{v:{a:72,b:56,c:55},t:1},2:{v:{a:70,b:55,c:56},t:1},3:{v:{a:74,b:57,c:56},t:1}},
                  g2:{1:{v:{a:75,b:57,c:57},t:1},2:{v:{a:76,b:58,c:56},t:1},3:{v:{a:74,b:56,c:57},t:1,c:'Senjata lepas semasa buah ke-3'}}}},
          k2:{nama:'SOLO KREATIF PUTRA',jenis:'PS',acara:'REMAJA PUTRA',bilJuri:3,kaedah:'median',skala10:true,paparMarkah:true,semasa:'s3',
          masa:{sasaran:180,toleransi:0,tolakLebih:true,tier:[{dari:15,hingga:30,tolak:5},{dari:31,hingga:60,tolak:10},{dari:61,hingga:9999,tolak:10}]},
          peserta:{s1:{undian:'1',nama:'Amirul Hakim',pasukan:'Perguruan Seni Gayong'},s2:{undian:'2',nama:"Wan Mohd 'Izzat",pasukan:'Persatuan Cekak Hanafi'},s3:{undian:'3',nama:'Faris Iskandar',pasukan:'Silat Lincah Malaysia'},s4:{undian:'4',nama:'Hafizuddin Razak',pasukan:'Seni Silat Harimau Berantai'},s5:{undian:'5',nama:'Danish Aqil',pasukan:'Silat Kalimah'}},
          rekodMasa:{s1:178,s2:202},tolak:{s2:{aks:1}},
          markah:{s1:{1:{v:{a:44,b:26},t:1},2:{v:{a:43,b:27},t:1},3:{v:{a:45,b:26},t:1,c:'Senjata kerambit kemas'}},
                  s2:{1:{v:{a:46,b:27},t:1},2:{v:{a:45,b:28},t:1},3:{v:{a:46,b:27},t:1}}}},
k6:{nama:'SENI TEMPUR SILAT PUTERA',jenis:'II',acara:'LSM',bilJuri:3,kaedah:'jumlah',paparMarkah:true,semasa:'',
            masa:{sasaran:120,toleransi:0,tolakLebih:false,tier:[{dari:1,hingga:10,tolak:5},{dari:11,hingga:20,tolak:10},{dari:21,hingga:9999,tolak:15}]},
            peserta:{m1:{undian:'1',nama:'Aiman & Hakimi',pasukan:'SMK Bukit Baru'},m2:{undian:'2',nama:"Danish & 'Irfan",pasukan:'SMK Ayer Keroh'},m3:{undian:'3',nama:'Rayyan & Zafran',pasukan:'SMK Alor Gajah'}},
            rekodMasa:{m1:118},tolak:{},
            markah:{m1:{1:{v:{a1:7,a2:7,a3:6,a4:7,b1:6,b2:6,c1:7,c2:6,d1:6,e1:1,e2:3,e3:1,e4:1},t:1},2:{v:{a1:7,a2:6,a3:6,a4:7,b1:7,b2:6,c1:6,c2:6,d1:6,e1:1,e2:3,e3:1,e4:1},t:1},3:{v:{a1:6,a2:7,a3:6,a4:6,b1:6,b2:6,c1:7,c2:7,d1:6,e1:1,e2:3,e3:1,e4:1},t:1}}}},
          k7:{nama:'SENI SILAT ASLI PUTERI',jenis:'III',acara:'PSM',bilJuri:3,kaedah:'jumlah',paparMarkah:true,semasa:'',
            masa:{sasaran:180,toleransi:0,tolakLebih:false,tier:[{dari:1,hingga:10,tolak:5},{dari:11,hingga:20,tolak:10},{dari:21,hingga:9999,tolak:15}]},
            peserta:{n1:{undian:'1',nama:'Nur Batrisyia',pasukan:'SMK Jasin'},n2:{undian:'2',nama:"Siti Nur'Aliya",pasukan:'SMK Merlimau'},n3:{undian:'3',nama:'Alya Maisarah',pasukan:'SMK Tinggi Melaka'}},
            rekodMasa:{n1:181},tolak:{},
            markah:{n1:{1:{v:{a1:7,a2:7,a3:6,b1:7,b2:6,c1:7,c2:6,c3:6,c4:7,d1:4,d2:3,e1:0,e2:0,e3:0,e4:0},t:1},2:{v:{a1:7,a2:6,a3:7,b1:6,b2:6,c1:7,c2:7,c3:6,c4:6,d1:3,d2:3,e1:0,e2:0,e3:0,e4:0},t:1},3:{v:{a1:6,a2:7,a3:7,b1:7,b2:7,c1:6,c2:6,c3:7,c4:7,d1:4,d2:4,e1:0,e2:-1,e3:0,e4:0},t:1}}}},
          k8:{nama:'SENI JURUS SILAT PUTERA',jenis:'IV',acara:'LSR',bilJuri:3,kaedah:'jumlah',paparMarkah:true,semasa:'',
            masa:{sasaran:120,toleransi:0,tolakLebih:false,tier:[{dari:1,hingga:10,tolak:5},{dari:11,hingga:20,tolak:10},{dari:21,hingga:9999,tolak:15}]},
            peserta:{q1:{undian:'1',nama:'Kumpulan A · SK Ayer Keroh',pasukan:'Melaka Tengah'},q2:{undian:'2',nama:'Kumpulan B · SK Durian Tunggal',pasukan:'Alor Gajah'},q3:{undian:'3',nama:'Kumpulan C · SK Jasin',pasukan:'Jasin'}},
            rekodMasa:{q1:121},tolak:{},
            markah:{q1:{1:{v:{a1:7,a2:7,a3:7,a4:6,a5:6,b1:7,b2:6,c1:7,c2:6,c3:1,c4:3,c5:1,c6:1},t:1},2:{v:{a1:7,a2:6,a3:7,a4:7,a5:6,b1:6,b2:6,c1:6,c2:7,c3:1,c4:3,c5:1,c6:1},t:1},3:{v:{a1:8,a2:7,a3:6,a4:6,a5:7,b1:7,b2:7,c1:7,c2:6,c3:1,c4:3.5,c5:1,c6:1},t:1}}}},
          k1:{nama:'SENI TARI SILAT PUTERA',jenis:'I',acara:'LSM',bilJuri:3,kaedah:'jumlah',paparMarkah:true,semasa:'p4',
          masa:{sasaran:120,toleransi:0,tolakLebih:false,tier:[{dari:1,hingga:10,tolak:5},{dari:11,hingga:20,tolak:10},{dari:21,hingga:9999,tolak:15}]},
          peserta:P,rekodMasa:{p1:118,p2:125,p3:104},tolak:{p3:{aks:1}},
          markah:{p1:{1:{v:full({a1:14,a2:7}),t:1},2:{v:full({a1:13,a2:7}),t:1},3:{v:full({a1:14}),t:1}},
                  p2:{1:{v:full({a1:15,a3:7}),t:1},2:{v:full({a1:16,a2:7}),t:1},3:{v:full({a1:15,a3:7}),t:1}},
                  p3:{1:{v:full({}),t:1},2:{v:full({a1:11,a5:5}),t:1}}}}}}});
  }
})();
