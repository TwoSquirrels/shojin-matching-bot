import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, statSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadModules<T>(dir: string): Promise<T[]> {
  const modules: T[] = [];
  const dirPath = join(__dirname, '..', dir);

  try {
    const files = readdirSync(dirPath);

    for (const file of files) {
      const filePath = join(dirPath, file);
      const stat = statSync(filePath);

      if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
        const module = (await import(`file://${filePath}`)) as { default: T };
        modules.push(module.default);
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not load modules from ${dir}:`, error);
  }

  return modules;
}
