import fs from 'fs';
import path from 'path';

const appPath = 'c:/Users/sethu/Downloads/srikrishna textile/frontend/src/App.tsx';
const content = fs.readFileSync(appPath, 'utf8');

const regex = /lazy\(\(\) => import\("(.+?)"\)\)/g;
let match;
while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    let absolutePath;
    if (importPath.startsWith('./')) {
        absolutePath = path.join('c:/Users/sethu/Downloads/srikrishna textile/frontend/src', importPath + '.tsx');
    } else if (importPath.startsWith('@/')) {
        absolutePath = path.join('c:/Users/sethu/Downloads/srikrishna textile/frontend/src', importPath.slice(2) + '.tsx');
    }
    
    if (absolutePath && !fs.existsSync(absolutePath)) {
        // Try .ts if .tsx doesn't exist
        if (!fs.existsSync(absolutePath.replace('.tsx', '.ts'))) {
             console.log(`MISSING: ${importPath} (Expected at ${absolutePath})`);
        }
    } else {
        // console.log(`OK: ${importPath}`);
    }
}
