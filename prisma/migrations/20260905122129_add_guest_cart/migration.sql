-- CreateTable
CREATE TABLE "GuestCart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestCartItem" (
    "id" SERIAL NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "GuestCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuestCartItem_cartId_productId_key" ON "GuestCartItem"("cartId", "productId");

-- AddForeignKey
ALTER TABLE "GuestCartItem" ADD CONSTRAINT "GuestCartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "GuestCart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestCartItem" ADD CONSTRAINT "GuestCartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
