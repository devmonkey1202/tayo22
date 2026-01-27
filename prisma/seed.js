const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, metaTitle: "타요드라이브", metaDescription: "방문운전연수 1:1", kakaoUrl: "https://pf.kakao.com/_hGxgkxj" },
  });

  const exists = await prisma.review.count();
  if (!exists) {
    await prisma.review.createMany({
      data: [
        { title: "역쉬 연수는 남편이 아닌 선생님께!", author: "happy01", content: "전문가에게 배우는 게 정답!\n이제 운전이 두렵지 않아요.", imageUrl: "", views: 120 },
        { title: "장롱면허 탈출! 자신감 회복!", author: "leejy011", content: "기초부터 주행, 주차까지 친절!", imageUrl: "", views: 190 },
        { title: "공포증 극복! 베스트 연수", author: "student7", content: "도로주행부터 주차까지 꼼꼼!", imageUrl: "", views: 87 }
      ]
    });
  }

  console.log("Seed finished");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});