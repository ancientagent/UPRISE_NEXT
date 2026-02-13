const fs=require('fs');
const path='node_modules/react-native-screens/android/src/main/java/com/swmansion/rnscreens/RNScreensPackage.kt';
if (!fs.existsSync(path)) { console.log('screens patch: file not found (older version or no android)'); process.exit(0); }
let s=fs.readFileSync(path,'utf8');
if (s.includes('override fun getReactModuleInfoProvider')) {
  s=s.replace(/override fun getReactModuleInfoProvider[\s\S]*?\n\}/, '// stripped for RN 0.66\n}');
  fs.writeFileSync(path,s,'utf8');
  console.log('screens patch: removed getReactModuleInfoProvider override');
} else {
  console.log('screens patch: nothing to patch');
}