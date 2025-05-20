import fs from 'fs'
import path from 'path'
import { MarkdownRenderer }from '@/components/MarkdownRenderer'

export default async function DocsPage() {
  const filePath = path.join(process.cwd(), 'README.md')
  const fileContent = fs.readFileSync(filePath, 'utf-8')

  return (
    <div className="p-10 bg-white dark:bg-black min-h-screen">
      <MarkdownRenderer content={fileContent} />
    </div>
  )
}
