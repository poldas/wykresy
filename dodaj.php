<?php
if (isset ( $_POST ) && $_SERVER ['REQUEST_METHOD'] == "POST" && isset ( $_FILES ['photoimg'] )) {
	$name = $_FILES ['photoimg'] ['name']; // get the name and size of the file to be uploaded.
	$size = $_FILES ['photoimg'] ['size'];
	$path = "../analiza/dane/";
	if (strlen ( $name )) {
		list ( $txt, $ext ) = strrchr ( $name, '.' );
			
			$actual_image_name = $name;
			$tmp = $_FILES ['photoimg'] ['tmp_name']; /* get the temperorary location of the file on the server */
			if (move_uploaded_file ( $tmp, $path . $actual_image_name )) {
				echo "przeniosło plik". $path . $actual_image_name;
			} else {
				echo "nie przeniosło pliku";
			}
	}
}
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Wykresy</title>
<meta name="viewport"
	content="initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet"
	href="node_modules/bootstrap3/dist/css/bootstrap.min.css">
<link rel="stylesheet"
	href="node_modules/bootstrap3/dist/css/bootstrap-theme.min.css">
<link rel="stylesheet"
	href="node_modules/bootstrap-toggle/css/bootstrap-toggle.min.css">
</head>
<body>
	<section>
		<header>
			<nav id="offcanvas"
				class="navmenu navmenu-inverse navmenu-fixed-right navmenu-site offcanvas"
				role="navigation"></nav>
		</header>
		<article class="container">


			<div id="app">
				<form id="imageform" method="post" enctype="multipart/form-data"
					action="dodaj.php">
					<div class="far">

						<label id="sel">Upload File&nbsp;&nbsp;&nbsp; </label>
						<div class="far1">
							<div id="preview"></div>

							<input type="file" name="photoimg" id="photoimg" /> <input
								type="submit" name="wyslij" id="send" />
						</div>
						<div class="clear"></div>
					</div>
				</form>
			</div>

		</article>
	</section>
	<script src="node_modules/jquery/dist/jquery.min.js"
		type="text/javascript"></script>
	<script src="node_modules/vue/dist/vue.min.js" type="text/javascript"></script>

	<script src="dodaj.js" type="text/javascript"></script>
</body>
</html>
<?php ?>