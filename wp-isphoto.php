<?php
/*
Plugin Name: IS Photo Gallery
Plugin URI: http://www.polaroidgallery.hostoi.com
Description: WordPress implementation of the picture gallery. 
Version: 1.0
Author: I. Savkovic
Author URI: http://www.polaroidgallery.hostoi.com

Originally based on the plugin by Bev Stofko http://www.stofko.ca/wp-imageflow2-wordpress-plugin/.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
*/
global $wp_version;
define('ISGALLERYVERSION', version_compare($wp_version, '2.8.4', '>='));

if(!defined("PHP_EOL")){define("PHP_EOL", strtoupper(substr(PHP_OS,0,3) == "WIN") ? "\r\n" : "\n");}

if (!class_exists("ISGallery")) {
Class ISGallery
{
	var $adminOptionsName = 'is3dgallery_options';

	/* html div ids */
	var $imageflow2div = 'is3d_imageflow';
	var $loadingdiv   = 'is3d_loading';
	var $imagesdiv    = 'is3d_images';
	var $captionsdiv  = 'is3d_captions';
	var $sliderdiv    = 'is3d_slider';
	var $scrollbardiv = 'is3d_scrollbar';
	var $noscriptdiv  = 'is3d_imageflow_noscript';
	var $largerimagesdiv    = 'is3d_largerimages';
	

	var $is3d_instance = 0;
	var $is3d_id = 0;

	function isgallery()
	{
		if (!ISGALLERYVERSION)
		{
			add_action ('admin_notices',__('WP-IS Photo Gallery requires at least WordPress 2.8.4','wp-is3dphoto'));
			return;
		}	
		
		register_activation_hook( __FILE__, array(&$this, 'activate'));
		register_deactivation_hook( __FILE__, array(&$this, 'deactivate'));
		add_action('init', array(&$this, 'addScripts'));	
		add_action('admin_menu', array(&$this, 'add_settings_page'));
		add_shortcode('wp-is3dphoto', array(&$this, 'flow_func'));	
		add_filter("attachment_fields_to_edit", array(&$this, "image_links"), null, 2);
		add_filter("attachment_fields_to_save", array(&$this, "image_links_save"), null , 2);

	}
	
	function activate()
	{
		/*
		** Nothing needs to be done for now
		*/
	}
	
	function deactivate()
	{
		/*
		** Nothing needs to be done for now
		*/
	}			
	
	function flow_func($attr,$is3d_id) {
		/*
		** WP-IS Photo gallery shortcode handler
		*/

		/* Increment the instance to support multiple galleries on a single page */
		$this->is3d_instance ++;


		/* Load scripts, get options */
		$options = $this->getAdminOptions();

		/* Produce the Javascript for this instance */
		$js  = "\n".'<script type="text/javascript">'."\n";
		$js .= 'jQuery(document).ready(function() { '."\n".'var is3dgallery_' . $this->is3d_instance . ' = new is3dgallery('.$this->is3d_instance.','.$this->is3d_id.');'."\n";
		$js .= 'is3dgallery_' . $this->is3d_instance . '.init( {';

		if ( !isset ($attr['rotate']) ) {
			$js .= 'conf_autorotate: "' . $options['autorotate'] . '", ';
		} else {
			$js .= 'conf_autorotate: "' . $attr['rotate'] . '", ';
		}
		$js .= 'conf_autorotatepause: ' . $options['pause'] . ', ';
		if ( !isset ($attr['startimg']) ) {
			$js .= 'conf_startimg: 1' . ', ';
		} else {
			$js .= 'conf_startimg: ' . $attr['startimg'] . ', ';
		}
		
			if ( !isset ($attr['nocaptions']) ) {
			$js .= 'conf_nocaptions: true' . ', ';
		} else {
			$js .= 'conf_nocaptions: ' . $options['nocaptions'] . ', ';
		}
			
		if ( !isset ($attr['samewindow']) ) {
			$js .= $options['samewindow']? 'conf_samewindow: true' : 'conf_samewindow: false';
		} else {
			$js .= 'conf_samewindow: ' . $attr['samewindow'];
		}

		$js .= '} );'."\n";
		$js .= '});'."\n";
		$js .= "</script>\n\n";

		/* Get the list of images */
		$image_list = apply_filters ('is3d_image_list', array(), $attr);
		if (empty($image_list)) {
		 	if ( !isset ($attr['dir']) ) {
				$image_list = $this->images_from_library($attr, $options);
			} else {
				$image_list = $this->images_from_dir($attr, $options);
	  		}
		}

		/* Prepare options */
		$bgcolor = $options['bgcolor'];
		$txcolor = $options['txcolor'];
		$slcolor = $options['slcolor'];
		$width   = $options['width'];
		$height  = $options['height'];
		$link    = $options['link'];
		$imgbdcolor = $options['imgbdcolor'];
		$imgbdwidth = $options['imgbdwidth'];
		$lgimgbdcolor = $options['lgimgbdcolor'];
		$lgimgbdwidth = $options['lgimgbdwidth'];
		$bgccolor = $options['bgccolor'];
		$bdccolor = $options['bdccolor'];
		$lgimgwidth = $options['lgimgwidth'];
		$lgimgheight = $options['lgimgheight'];
		$imgwidth = $options['imgwidth'];
	

		$plugin_url = plugins_url( '', __FILE__ );

		/**
		* Start output
		*/
		$noscript = '<noscript><div id="' . $this->noscriptdiv . '_' . $this->is3d_instance . '" class="' . $this->noscriptdiv . '">';	
		$output  = '<div id="' . $this->imageflow2div . '_' . $this->is3d_instance . '" class="' . $this->imageflow2div . '" style="background-color: ' . $bgcolor . '; color: ' . $txcolor . '; width: ' . $width . '; height: ' . $height . '">' . PHP_EOL; 
		$output .= '<div id="' . $this->loadingdiv . '_' . $this->is3d_instance . '" class="' . $this->loadingdiv . '" style="color: ' . $txcolor .';">' . PHP_EOL;
		$output .= '<b>';
		$output .= __('Loading Images','wp-is3dphoto');
		$output .= '</b><br/>' . PHP_EOL;
		$output .= '<img src="' . $plugin_url . '/img/loading.gif" width="208" height="13" alt="' . $this->loadingdiv . '" />' . PHP_EOL;
		$output .= '</div>' . PHP_EOL;
		$output .= '	<div id="' . $this->imagesdiv . '_' . $this->is3d_instance . '" class="' . $this->imagesdiv . '" style="border-width: ' . $imgbdwidth . '; border-color: ' . $imgbdcolor . '; width: ' . $imgwidth . ';">' . PHP_EOL;	
		
	/**	$output .= '<style type="text/css">.is3d_images img { 
           border : 4px solid #C9D0E3;} </style>' . PHP_EOL;
           */
           	
		/**
		* Add images
		*/
		if (!empty ($image_list) ) {
		    $i = 0;
		    foreach ( $image_list as $this_image ) {

			
			/* What does the carousel image link to? */
			$linkurl 		= $this_image['link'];
			$rel 			= '';
			$dsc			= '';
			if ($linkurl === '') {
				/* We are linking to the popup - use the title and description as the alt text */
				$linkurl = $this_image['large'];
				$rel = ' data-style="is3d_lightbox"';
				$alt = ' alt="'.$this_image['title'].'"';
				if ($this_image['desc'] != '') {
					
					$dsc = ' data-description="' . htmlspecialchars(str_replace(array("\r\n", "\r", "\n"), "<br />", $this_image['desc'])) . '"';
				}
			} else {
				/* We are linking to an external url - use the title as the alt text */
				$alt = ' alt="'.$this_image['title'].'"';
			}
			
		
		$output .= '<img src="'.$this_image['small'].'" data-link="'.$linkurl.'"'. $rel . $alt . $dsc . ' />';

		
			/* build separate thumbnail list for users with scripts disabled */
			$noscript .= '<a href="' . $linkurl . '"><img src="' . $this_image['small'] .'" width="100"  alt="'.$this_image['title'].'" /></a>';
			$i++;
			
		    }
	    $this->is3d_id ++;
		}
					
		
		$output .= '</div>' . PHP_EOL;
/* larger image	*/

$output .= '<div id="' . $this->largerimagesdiv . '_' . $this->is3d_instance . '" class="' . $this->largerimagesdiv . '" style="border-width: ' . $lgimgbdwidth . '; border-color: ' . $lgimgbdcolor . '; width: ' . $lgimgwidth . '; height: ' . $lgimgheight . ';">' . PHP_EOL;
/*$output .= '<div id="' . $this->largerimagesdiv . '_' . $this->is3d_instance . '" class="' . $this->largerimagesdiv . '">' . PHP_EOL;*/
/*$output .= '<div id="' . $this->largerimages . '_' . $this->is3d_instance . '" class="' . $this->largerimages . '" style="border-width: ' . $lgimgbdwidth . '; border-color: ' . $lgimgbdcolor . ';">' . PHP_EOL;	*/
		/**
		* Add images
		*/
		if (!empty ($image_list) ) {
		    $i = 0;
		    foreach ( $image_list as $this_image ) {

			
			/* What does the carousel image link to? */
			$linkurl 		= $this_image['link'];
			$rel 			= '';
			$dsc			= '';
			if ($linkurl === '') {
				/* We are linking to the popup - use the title and description as the alt text */
				$linkurl = $this_image['large'];
				$rel = ' data-style="is3d_lightbox"';
				$alt = ' alt="'.$this_image['title'].'"';
				if ($this_image['desc'] != '') {
					
					$dsc = ' data-description="' . htmlspecialchars(str_replace(array("\r\n", "\r", "\n"), "<br />", $this_image['desc'])) . '"';
				}
			} else {
				/* We are linking to an external url - use the title as the alt text */
				$alt = ' alt="'.$this_image['title'].'"';
			}
			
		
		$output .= '<img src="'.$this_image['small'].'" data-link="'.$linkurl.'"'. $rel . $alt . $dsc . ' />';

		
			/* build separate thumbnail list for users with scripts disabled */
			$noscript .= '<a href="' . $linkurl . '"><img src="' . $this_image['small'] .'" width="100"  alt="'.$this_image['title'].'" /></a>';
			$i++;
			
		    }
    $this->is3d_id ++;
		}
					
		
		$output .= '</div>' . PHP_EOL;
		
			
		
		
		
		
		
		$output .= '<div id="' . $this->captionsdiv . '_' . $this->is3d_instance . '" class="' . $this->captionsdiv . '" style="background-color: ' . $bgccolor . ' ; border-color: ' . $bdccolor . '"';
		if ($options['nocaptions']) $output .= ' style="display:none !important;"';
		$output .= '></div>' . PHP_EOL;
		$output .= '<div id="' . $this->scrollbardiv . '_' . $this->is3d_instance . '" class="' . $this->scrollbardiv;
		if ($slcolor == "black") $output .= ' black';
		$output .= '"';
		if ($options['noslider']) $output .= ' style="display:none !important;"';
		$output .= '><div id="' . $this->sliderdiv . '_' . $this->is3d_instance . '" class="' . $this->sliderdiv . '">' . PHP_EOL;
		$output .= '</div>';
		$output .= '</div>' . PHP_EOL;
		$output .= $noscript . '</div></noscript></div>';	

		return $js . $output;
		
		

	}

	function images_from_library ($attr, $options) {
		/*
		** Generate a list of the images we are using from the Media Library
		*/
		if ( isset( $attr['orderby'] ) ) {
			$attr['orderby'] = sanitize_sql_orderby( $attr['orderby'] );
			if ( !$attr['orderby'] )
				unset( $attr['orderby'] );
		}

		/*
		** Standard gallery shortcode defaults that we support here	
		*/
		global $post;
		extract(shortcode_atts(array(
				'order'      => 'ASC',
				'orderby'    => 'menu_order ID',
				'id'         => $post->ID,
				'include'    => '',
				'exclude'    => '',
				'mediatag'	 => '',	// corresponds to Media Tags plugin by Paul Menard
		  ), $attr));
	
		$id = intval($id);
		if ( 'RAND' == $order )
			$orderby = 'none';

		if ( !empty($mediatag) ) {
			$mediaList = get_attachments_by_media_tags("media_tags=$mediatag&orderby=$orderby&order=$order");
			$attachments = array();
			foreach ($mediaList as $key => $val) {
				$attachments[$val->ID] = $mediaList[$key];
			}
		} elseif ( !empty($include) ) {
			$include = preg_replace( '/[^0-9,]+/', '', $include );
			$_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );

			$attachments = array();
			foreach ( $_attachments as $key => $val ) {
				$attachments[$val->ID] = $_attachments[$key];
			}
		} elseif ( !empty($exclude) ) {
			$exclude = preg_replace( '/[^0-9,]+/', '', $exclude );
			$attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
		} else {
			$attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
		}

		$image_list = array();
		foreach ( $attachments as $id => $attachment ) {
			$small_image = wp_get_attachment_image_src($id, "medium");
			$large_image = wp_get_attachment_image_src($id, "large");

			/* If the media description contains an url and the link option is enabled, use the media description as the linkurl */
			$link_url = '';
			if (($options['link'] == 'true') && 
				((substr($attachment->post_content,0,7) == 'http://') || (substr($attachment->post_content,0,8) == 'https://'))) {
				$link_url = $attachment->post_content;
			}

			$image_link = get_post_meta($id, '_is3d-image-link', true);
			if (isset($image_link) && ($image_link != '')) $link_url = $image_link;

			$image_list[] = array (
				'small' => $small_image[0],
				'large' => $large_image[0],
				'link'  => $link_url,
				'title' => $attachment->post_title,
				'desc'  => $attachment->post_content,
			);

		}
		return $image_list;
		
	}

	function images_from_dir ($attr, $options) {
		/*
		** Generate the image list by reading a folder
		*/
		$image_list = array();

		$galleries_path = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/' . $this->get_path($options['gallery_url']);
		if (!file_exists($galleries_path))
			return '';

		/*
		** Gallery directory is ok - replace the shortcode with the image gallery
		*/
		$plugin_url = get_option('siteurl') . "/" . PLUGINDIR . "/" . plugin_basename(dirname(__FILE__)); 			
			
		$gallerypath = $galleries_path . $attr['dir'];
		if (file_exists($gallerypath))
		{	
			$handle = opendir($gallerypath);
			while ($image=readdir($handle)) {
				if (filetype($gallerypath."/".$image) != "dir" && !preg_match('/refl_/',$image)) {
					$pageURL = 'http';
					if (isset($_SERVER['HTTPS']) && ($_SERVER["HTTPS"] == "on")) {$pageURL .= "s";}
					$pageURL .= "://";
					if ($_SERVER["SERVER_PORT"] != "80") {
				   	$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"];
				} else {
				   	$pageURL .= $_SERVER["SERVER_NAME"];
				}
				$imagepath = $pageURL . '/' . $this->get_path($options['gallery_url']) . $attr['dir'] . '/' . $image;
				$image_list[] = array (
					'small' => $imagepath,
					'large' => $imagepath,
					'link'  => '',
					'title' => $image,
					'desc'  => '',
			);
			    }
		//	    $this->is3d_id ++;
			}
			closedir($handle);
		}

		return $image_list;
	}


	function getAdminOptions() {
		/*
		** Merge default options with the saved values
		*/
		$use_options = array(	'gallery_url' => '0', 	// Path to gallery folders when not using built in gallery shortcode
						'bgcolor' => '#333333', // Background color defaults to black
						'txcolor' => '#583B72', // Text color defaults to white
						'slcolor' => 'white',	// Slider color defaults to white
						'link'    => 'false',	// Don't link to image description
						'width'   => '640px',	// Width of containing div
						'height'  => '480px',	// Height of containing div
						'autorotate' => 'off',	// True to enable auto rotation
						'pause' =>	'3000',	// Time to pause between auto rotations
						'samewindow' => false,	// True to open links in same window rather than new window
						'nocaptions' => false,	// True to hide captions in the carousel
						'noslider' => true,	// True to hide the scrollbar
						'defheight' => false,	// True to use default value
						'bgccolor' => '#333333', // Background color defaults 
						'bdccolor' => '#333333', // Background color defaults 
						'imgbdcolor' => '#666666', // Border color defaults 
						'lgimgbdcolor' => '#666666', // Border color of central image defaults 
						'imgbdwidth'=> '2px',	// Width of image border
						'lgimgbdwidth'=> '5px',	// Width of large image border
						'lgimgwidth'=> '160px',	// Width of large image
						'lgimgheight'=> '120px',	// Height of large image
						'imgwidth'=> '100px'	// Width of image
					);
		$saved_options = get_option($this->adminOptionsName);
		if (!empty($saved_options)) {
			foreach ($saved_options as $key => $option)
				$use_options[$key] = $option;
		}
		
		if ($use_options['defheight'] == 'true')
		{
			$use_options['height'] = '480px';
			}
			

		
		return $use_options;
	}

	function get_path($gallery_url) {
		/*
		** Determine the path to prepend with DOCUMENT_ROOT
		*/
		if (substr($gallery_url, 0, 7) != "http://") return $gallery_url;

		$dir_array = parse_url($gallery_url);
		return $dir_array['path'];
	}

	function addScripts()
	{
		if (!is_admin()) {
			wp_enqueue_style( 'is3dgallerycss',  plugins_url('css/screen.css', __FILE__));
			wp_enqueue_script('is3d_gallery', plugins_url('js/is3dgallery.js', __FILE__), array('jquery'), '1.9');
		} else {
			wp_enqueue_script('is3d_utility_js', plugins_url('js/is3d_utility.js', __FILE__));
		}
	}	

	function image_links($form_fields, $post) {
		$form_fields["is3d-image-link"] = array(
			"label" => __("WP-IS Photo Gallery Link"),
			"input" => "", // this is default if "input" is omitted
			"value" => get_post_meta($post->ID, "_is3d-image-link", true),
      	 	"helps" => __("To be used with carousel added via [wp-is3dphoto] shortcode."),
		);
	   return $form_fields;
	}

	function image_links_save($post, $attachment) {
		// $attachment part of the form $_POST ($_POST[attachments][postID])
      	// $post['post_type'] == 'attachment'
		if( isset($attachment['is3d-image-link']) ){
			// update_post_meta(postID, meta_key, meta_value);
			update_post_meta($post['ID'], '_is3d-image-link', $attachment['is3d-image-link']);
		}
		return $post;
	}

	function add_settings_page() {
		add_options_page('WP-IS Photo Gallery Options', 'WP-IS Photo Gallery', 'manage_options', 'wpIS3DPhoto', array(&$this, 'settings_page'));
	}

	function settings_page() {
		global $options_page;

		if (!current_user_can('manage_options'))
			wp_die(__('Sorry, but you have no permission to change settings.','wp-is3dphoto'));	
			
		$options = $this->getAdminOptions();
		if (isset($_POST['save_is3dgallery']) && ($_POST['save_is3dgallery'] == 'true') && check_admin_referer('is3dgallery_options'))
		{
			echo "<div id='message' class='updated fade'>";	

			/*
			** Validate the background colour
			*/
			if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_bgc'])) || ($_POST['is3dgallery_bgc'] == 'transparent')) {
				$options['bgcolor'] = $_POST['is3dgallery_bgc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid background color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_bgc'] ."</b></p>";	
			}

			/*
			** Validate the text colour
			*/
			if (preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_txc'])) {
				$options['txcolor'] = $_POST['is3dgallery_txc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid text color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_txc'] ."</b></p>";	
			}
			
 			/*
			** Validate the caption background colour
			*/
			if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_bgcc'])) || ($_POST['is3dgallery_bgcc'] == 'transparent')) {
				$options['bgccolor'] = $_POST['is3dgallery_bgcc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid background color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_bgcc'] ."</b></p>";	
			}
			/*
			** Validate the caption border colour
			*/
		/*	if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_bdcc'])) || ($_POST['is3dgallery_bdcc'] == 'transparent')) {
				$options['bdccolor'] = $_POST['is3dgallery_bdcc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid background color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_bdcc'] ."</b></p>";	
			}
			*/
			/* 
			** Look for disable captions option
			*/
			if (isset ($_POST['is3dgallery_nocaptions']) && ($_POST['is3dgallery_nocaptions'] == 'nocaptions')) {
				$options['nocaptions'] = true;
				
				
			} else {
				$options['nocaptions'] = false;
				
			}
			/*
			** Validate the images border colour
			*/
			if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_bdimg'])) || ($_POST['is3dgallery_bdimg'] == 'transparent')) {
				$options['imgbdcolor'] = $_POST['is3dgallery_bdimg'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid background color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_bdimg'] ."</b></p>";	
			}
			/*
			/*
			** Validate the large image border colour
			*/
	/*		if ((preg_match('/^#[a-f0-9]{6}$/i', $_POST['is3dgallery_lgbdimg'])) || ($_POST['is3dgallery_lgbdimg'] == 'transparent')) {
				$options['lgimgbdcolor'] = $_POST['is3dgallery_lgbdimg'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid border color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_lgbdimg'] ."</b></p>";	
			} */
			/*

			/*
			** Validate the slider color
			*/
		/*	if (($_POST['is3dgallery_slc'] == 'black') || ($_POST['is3dgallery_slc'] == 'white')) {
				$options['slcolor'] = $_POST['is3dgallery_slc'];
			} else {
			echo "<p><b style='color:red;'>".__('Invalid slider color, not saved.','wp-is3dphoto'). " - " . $_POST['is3dgallery_slc'] ."</b></p>";	
			}
			*/

			/* 
			** Look for disable slider option
			*/
		/*	if (isset ($_POST['is3dgallery_noslider']) && ($_POST['is3dgallery_noslider'] == 'noslider')) {
			*/
				$options['noslider'] = true;
				
				
		/*	} else {
				$options['noslider'] = false;
			}
			*/

			/*
			** Accept the container width
			*/
			$options['width'] = $_POST['is3dgallery_width'];
			
			/*
			
				/*
			** Accept the image border width
			*/
			$options['imgbdwidth'] = $_POST['is3dgallery_imgbdwidth'];
			
				/*
			** Accept the large image border width
			*/
			$options['lgimgbdwidth'] = $_POST['is3dgallery_lgimgbdwidth'];
			
	/*
			** Accept the  large image width
			*/
			$options['lgimgwidth'] = $_POST['is3dgallery_lgimgwidth'];
			
				/*
			** Accept the large image height
			*/
			$options['lgimgheight'] = $_POST['is3dgallery_lgimgheight'];
			
			/*
			** Accept the image width
			*/
			$options['imgwidth'] = $_POST['is3dgallery_imgwidth'];
			
				/*
						
			
			
			/*
			** Look for the container height
			*/
	//		$options['height'] = $_POST['is3dgallery_height'];
			
			if (isset ($_POST['is3dgallery_defheight']) && ($_POST['is3dgallery_defheight'] == 'defheight')) {
				$options['defheight'] = true;
				$options['height'] = $_POST['height'];
			} else {
				$options['defheight'] = false;
				$options['height'] = $_POST['is3dgallery_height'];
			}
			

			
			/* 
			** Look for link to new window option
			*/
			if (isset ($_POST['is3dgallery_samewindow']) && ($_POST['is3dgallery_samewindow'] == 'same')) {
				$options['samewindow'] = true;
			} else {
				$options['samewindow'] = false;
			}

			/* 
			** Look for auto rotate option
			*/
			if (isset ($_POST['is3dgallery_autorotate']) && ($_POST['is3dgallery_autorotate'] == 'autorotate')) {
				$options['autorotate'] = 'on';
			} else {
				$options['autorotate'] = 'off';
			}

			/*
			** Accept the pause value
			*/
		/*	$options['pause'] = $_POST['is3dgallery_pause']; */

			/*
			** Done validation, update whatever was accepted
			*/
			$options['gallery_url'] = trim($_POST['is3dgallery_path']);
			update_option($this->adminOptionsName, $options);
			echo '<p>'.__('Settings were saved.','wp-is3dphoto').'</p></div>';	
		}
			
		?>
					
		<div class="wrap">
			
			<h2>WP-IS Photo Gallery Settings</h2>
			<form action="options-general.php?page=wpIS3DPhoto" method="post">
	    		<h3><?php echo __('Formatting','wp-is3dphoto'); ?></h3>

	    		<table class="form-table">
				<tr>
					<th scope="row">
					<label for="is3dgallery_bgc"><?php echo __('Background color', 'wp-is3dphoto'); ?></label>
					</td>
					<td>
					<input type="text" name="is3dgallery_bgc" id="is3dgallery_bgc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['bgcolor']; ?>">
					&nbsp;<em>Hex value or "transparent"</em>
					</td>
				</tr>
				
				
				
				<tr>
					<th scope="row">
					<?php echo __('Container width CSS', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="text" name="is3dgallery_width" value="<?php echo $options['width']; ?>"> 
					</td>
				</tr>
				<tr>
					<th scope="row">
					<?php echo __('Container height', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="text" name="is3dgallery_height" value="<?php echo $options['height']; ?>"> 
					&nbsp;<label for="is3dgallery_defheight">Default value (480px): </label>
					<input type="checkbox" name="is3dgallery_defheight" id="is3dgallery_defheight" value="defheight" <?php if ($options['defheight'] == 'true') echo ' CHECKED'; ?> />
				</td>
				</tr>
					</table>
				<h3><?php echo __('Captions Formatting','wp-is3dphoto'); ?></h3>
				<table class="form-table">
				<tr>
					<th scope="row">
					<label for="is3dgallery_txc"><?php echo __('Text color', 'wp-is3dphoto'); ?></label>
					</td>
					<td>
					<input type="text" name="is3dgallery_txc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['txcolor']; ?>">
					&nbsp;<label for="is3dgallery_nocaptions">Disable captions: </label>
					<input type="checkbox" name="is3dgallery_nocaptions" id="is3dgallery_nocaptions" value="nocaptions" <?php if ($options['nocaptions'] == 'true') echo ' CHECKED'; ?> />
					</td>
				</tr>
				<tr>
					<th scope="row">
					<label for="is3dgallery_bgcc"><?php echo __('Background color', 'wp-is3dphoto'); ?></label>
					</td>
					<td>
					<input type="text" name="is3dgallery_bgcc" id="is3dgallery_bgcc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['bgccolor']; ?>">
					&nbsp;<em>Hex value or "transparent"</em>
					</td>
				</tr>
			<!--	<tr>
					<th scope="row">
					<label for="is3dgallery_bdcc"><?php echo __('Border color', 'wp-is3dphoto'); ?></label>
					</td>
					<td>
					<input type="text" name="is3dgallery_bdcc" id="is3dgallery_bdcc" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['bdccolor']; ?>">
					&nbsp;<em>Hex value or "transparent"</em>
					</td>
				</tr>-->
					
					
			</table>
			
				<h3><?php echo __('Pictures Formatting','wp-is3dphoto'); ?></h3>
				<table class="form-table">
				<tr>
					<th scope="row">
					<?php echo __('Picture width', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="text" name="is3dgallery_imgwidth" value="<?php echo $options['imgwidth']; ?>">
					&nbsp;<em>Default value 80px</em> 
					</td>
				</tr>	
				<tr>
					<th scope="row">
					<label for="is3dgallery_bdimg"><?php echo __('Border color', 'wp-is3dphoto'); ?></label>
					</td>
					<td>
					<input type="text" name="is3dgallery_bdimg" id="is3dgallery_bdimg" onkeyup="colorcode_validate(this, this.value);" value="<?php echo $options['imgbdcolor']; ?>">
					&nbsp;<em>Hex value or "transparent"</em>
					</td>
				</tr>
					<tr>
					<th scope="row">
					<?php echo __('Border width', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="text" name="is3dgallery_imgbdwidth" value="<?php echo $options['imgbdwidth']; ?>"> 
					</td>
				</tr>
					
			</table>
		
				
			

	    		<h3><?php echo __('Behaviour','wp-is3dphoto'); ?></h3>
			<p>The images in the carousel will by default link to a Lightbox enlargement of the image. Alternatively, you may specify
a URL to link to each image. This link address should be configured in the image uploader/editor of the Media Library.</p>
	    		<table class="form-table">
				<tr>
					<th scope="row">
					<?php echo __('Open URL links in same window', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="checkbox" name="is3dgallery_samewindow" value="same" <?php if ($options['samewindow'] == 'true') echo ' CHECKED'; ?> /> <em>The default is to open links in a new window</em>
					</td>
				</tr>
				
			
	<!--			<tr>
					<th scope="row">
					<?php echo __('Enable auto rotation', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="checkbox" name="is3dgallery_autorotate" value="autorotate" <?php if ($options['autorotate'] == 'on') echo ' CHECKED'; ?> /> <em>This may be overridden in the shortcode</em>
					</td>
				</tr>
				<tr>
					<th scope="row">
					<?php echo __('Auto rotation pause', 'wp-is3dphoto'); ?>
					</td>
					<td>
					<input type="text" name="is3dgallery_pause" value="<?php echo $options['pause']; ?>"> 
					</td>
				</tr>-->
			</table>

	    		<h3><?php echo __('Galleries Based on Folders','wp-is3dphoto'); ?></h3>
			  <a style="cursor:pointer;" title="Click for help" onclick="toggleVisibility('detailed_display_tip');">Click to toggle detailed help</a>
			  <div id="detailed_display_tip" style="display:none; width: 600px; background-color: #eee; padding: 8px;
border: 1px solid #aaa; margin: 20px; box-shadow: rgb(51, 51, 51) 2px 2px 8px;">
				<p>You can upload a collection of images to a folder and have WP-IS Photo Gallery read the folder and gather the images, without the need to upload through the Wordpress image uploader. Using this method provides fewer features in the gallery since there are no titles, links, or descriptions stored with the images. This is provided as a quick and easy way to display an image carousel.</p>
				<p>The folder structure should resemble the following:</p>
				<p>
- wp-content<br />
&nbsp;&nbsp;&nbsp;- galleries<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- gallery1<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image1.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image2.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image3.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- gallery2<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image4.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image5.jpg<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- image6.jpg</p>

				<p>With this structure you would enter "wp-content/galleries/" as the folder path below.</p>
</div>

	    		<table class="form-table">
	    			<tr>
					<th scope="row">
					<?php echo __('Folder Path','wp-is3dphoto'); ?>	
					</td>
					<td>
					<?php echo __('This should be the path to galleries from homepage root path, or full url including http://.','wp-is3dphoto'); ?>
					<br /><input type="text" size="35" name="is3dgallery_path" value="<?php echo $options['gallery_url']; ?>">
					<br /><?php echo __('e.g.','wp-is3dphoto'); ?> wp-content/galleries/
					<br /><?php echo __('Ending slash, but NO starting slash','wp-is3dphoto'); ?>
					</td>
				</tr>
	    			<tr>
					<th scope="row">
					<?php echo __('These folder galleries were found:','wp-is3dphoto'); ?>	
					</th>
					<td>
					<?php
						$galleries_path = rtrim($_SERVER['DOCUMENT_ROOT'], '/') . '/' . $this->get_path($options['gallery_url']);
						if (file_exists($galleries_path)) {
							$handle	= opendir($galleries_path);
							while ($dir=readdir($handle))
							{
								if ($dir != "." && $dir != "..")
								{									
									echo "[wp-is3dphoto dir=".$dir."]";
									echo "<br />";
								}
							}
							closedir($handle);								
						} else {
							echo "Gallery path doesn't exist";
						}					
					?>
					</td>
				</tr>
			</table>

			<p class="submit"><input class="button button-primary" name="submit" value="<?php echo __('Save Changes','wp-is3dphoto'); ?>" type="submit" /></p>

			   		

			<input type="hidden" value="true" name="save_is3dgallery">
			<?php
			if ( function_exists('wp_nonce_field') )
				wp_nonce_field('is3dgallery_options');
			?>
			</form>				

		</div>
		
		<?php			
	}		
}

}

if (class_exists("ISGallery")) {
	$isgallery = new ISGallery();
}
?>
