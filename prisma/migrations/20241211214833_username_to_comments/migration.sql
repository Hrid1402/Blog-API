/*
  Warnings:

  - Added the required column `username` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "username" VARCHAR(250) NOT NULL;
