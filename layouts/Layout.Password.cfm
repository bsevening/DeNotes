﻿<cfoutput><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head>	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />	<title>Welcome to DeNotes!!</title>	<link rel="stylesheet" href="/#getSetting("app_mapping")#/includes/styles/blueprint/screen.css" type="text/css" media="screen, projection">     <link rel="stylesheet" href="/#getSetting("app_mapping")#/includes/styles/blueprint/print.css" type="text/css" media="print">     <!--[if lt IE 8]><link rel="stylesheet" href="/#getSetting("app_mapping")#/includes/styles/blueprint/ie.css" type="text/css" media="screen, projection"><![endif]-->     <link rel="stylesheet" href="/#getSetting("app_mapping")#/includes/styles/solitary.css" type="text/css" media="screen, projection"> </head><body><!--- Render The View. This is set wherever you want to render the view in your Layout. ---><div class="clear" style="height: 20px;"></div>		<div>		<div class="clearfix" style="width:100%"></div>				<div id="bodyView" class="bodyView span-20 box shadow round-corners">			#renderView()#		</div>		<div class="clear"></div>			</div>		<div class="clear" style="height: 40px;"></div></body></html></cfoutput>