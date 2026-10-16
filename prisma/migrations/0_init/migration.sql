-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "foodName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "typeFood" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "typeMeasure" TEXT NOT NULL,
    "dateEntry" TIMESTAMP(3) NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "email" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

