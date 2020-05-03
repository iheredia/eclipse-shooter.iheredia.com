const { files } = process.env.DETA_EMULATED ? require('./mock-detalib') : require('detalib');
const fs = require('fs');

const jsFiles = [
  'client_setup.js',
  'client_animation.js',
  'client_menu.js',
  'client_background.js',
  'client_background_stars.js',
  'client_spaceship.js',
  'client_spaceship_player.js',
  'client_spaceship_doomed.js',
  'client_obstacles.js',
  'client_collisions.js',
  'client_ui.js'
];
let jsFilesContent = '';
jsFiles.map(filename => {
  jsFilesContent += fs.readFileSync(filename).toString();
});
files.put('main.js', jsFilesContent);


const cssFiles = [
  'styles_main.css',
  'styles_menu.css',
  'styles_space_shooter_ui.css'
]
let cssFilesContent = '';
cssFiles.map(filename => {
  cssFilesContent += fs.readFileSync(filename).toString();
})
files.put('styles.css', cssFilesContent)

const homeContent = fs.readFileSync('./index.html').toString();

module.exports = {
  homeContent,
};
