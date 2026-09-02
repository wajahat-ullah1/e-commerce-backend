CREATE UNIQUE INDEX "Address_userId_address_unique"
ON "Address" (
    "userId",
    LOWER(TRIM("addressLine1")),
    LOWER(TRIM(COALESCE("addressLine2", ''))),
    LOWER(TRIM("city")),
    LOWER(TRIM(COALESCE("state", ''))),
    TRIM("postalCode"),
    LOWER(TRIM("country"))
);