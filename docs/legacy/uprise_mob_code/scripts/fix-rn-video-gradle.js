const fs = require('fs'), p = 'node_modules/react-native-video/android/build.gradle';
if (fs.existsSync(p)) {
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(/\bprovided\b/g, 'compileOnly');
  fs.writeFileSync(p, s, 'utf8');
  console.log('Patched react-native-video build.gradle: provided→compileOnly');
} else {
  console.log('react-native-video build.gradle not found; skipping');
}
