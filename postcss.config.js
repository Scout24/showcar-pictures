module.exports = {
	use: ["autoprefixer"],
	input: "dist/showcar-pictures.css",
	output: "dist/showcar-pictures.pre.css",
  autoprefixer: {
    "browsers": "> 5%"
  }
};
