-- CreateTable
CREATE TABLE "Card" (
    "cardId" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardImage" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "Slot" (
    "slotId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("slotId")
);

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE RESTRICT ON UPDATE CASCADE;
