export const seedPosts = () => {
   const exists = localStorage.getItem("posts");
   if(exists) return;
   const now = Date.now();
   const rows = Array.from({ length: 57 }).map((_, i)=>({
       id: i + 1,
       title: `게시판 데모 제목 ${i + 1}`,
       writer: i % 5 === 0 ? '관리자' : `손님${(i % 9) + 1}`,
       content: `데모 본문입니다. \n ${i + 1}항목의 데모`,
       pass: '1234',
       hit: Math.floor(Math.random()*1000),
       wdate: new Date(now - i * 3600_000).toISOString()
   }));
   localStorage.setItem("posts", JSON.stringify(rows));
};

export const loadPosts = () => JSON.parse(localStorage.getItem("posts") || '[]');
export const savePosts = (rows) => localStorage.setItem("posts", JSON.stringify(rows));
