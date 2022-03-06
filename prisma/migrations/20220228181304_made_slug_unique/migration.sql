-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "media" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "block" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "askingFor" TEXT NOT NULL,
    "safety" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "subject" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionTranslation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "languageCode" TEXT NOT NULL,
    "questionContent" TEXT NOT NULL,
    "answerA" TEXT NOT NULL,
    "answerB" TEXT NOT NULL,
    "answerC" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    CONSTRAINT "QuestionTranslation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToQuestion" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_slug_key" ON "Question"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToQuestion_AB_unique" ON "_CategoryToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToQuestion_B_index" ON "_CategoryToQuestion"("B");
