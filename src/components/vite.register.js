// Globally register all components in this folder.
// Components are registered using the filename.

// https://vitejs.dev/guide/features.html#glob-import
const modules = import.meta.globEager('./**/*.vue')

// console.log(modules)
function pathToFileName (fileName) {
  return fileName
    .replace(/^.*[\\/]/, '') // Remove path
    .replace(/\.\w+$/, '') // Remove extension
}

function install (Vue, config = {}) {
  Object.entries(modules).map(([key, value]) => {
    // console.log(key, value)
    Vue.component(pathToFileName(key), value.default)
  })
}

export default install
