/**
 *	IS Photo Gallery 1.0
 *
 *    This provides an 3d style gallery
 *    
 *
 *    Resources ----------------------------------------------------
 * [1] http://www.polaroidgallery.hostoi.com/, I. Savkovic
 * [2] http://www.stofko.ca/wp-imageflow2-wordpress-plugin/, Bev Stofko
 * [3] http://www.script-tutorials.com/3d-gallery-using-javascript/, Andrey Prikaznov
 *	[4] http://www.adventuresinsoftware.com/blog/?p=104#comment-1981, Michael L. Perry's Cover Flow
 *	[5] http://www.finnrudolph.de/, Finn Rudolph's imageflow, version 0.9 
 *	[6] http://adomas.org/javascript-mouse-wheel, Adomas Paltanavicius JavaScript mouse wheel code
 *	[7] Touch screen control derived from scripts courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM
 *    --------------------------------------------------------------
 */

function is3dgallery(instance,index1) {

/* Options */
this.defaults =
{
conf_autorotate:		'off',	// Sets auto-rotate option 'on' or 'off', default is 'off'
conf_autorotatepause: 	3000,		// Set the pause delay in the auto-rotation
conf_startimg:		1,		// Starting focused image
conf_nocaptions:		false,		// Captions
conf_samewindow:		false		// Open links in same window vs the default of opening in new window

};

/* Possible future options */
this.conf_focus =			4;		// Sets the numbers of images on each side of the focused one
//this.conf_ifp_slider_width =	14;         // Sets the px width of the slider div
this.conf_ifp_images_cursor =	'pointer';  // Sets the cursor type for all images default is 'default'
//this.conf_ifp_slider_cursor =	'default';  // Sets the slider cursor type: try "e-resize" default is 'default'

/* HTML div ids that we manipulate here */
this.ifp_imageflow2div =	'is3d_imageflow_' + instance;
this.ifp_loadingdiv =		'is3d_loading_' + instance;
this.ifp_imagesdiv =		'is3d_images_' + instance;
this.ifp_captionsdiv =		'is3d_captions_' + instance;
this.ifp_sliderdiv =		'is3d_slider_' + instance;
this.ifp_scrollbardiv =		'is3d_scrollbar_' + instance;
//this.ifp_largerimagesdiv =		'is3d_largerimages_' + instance;


/* The overlay is shared among all instances */
this.ifp_overlaydiv =		'is3d_overlay';
this.ifp_overlayclosediv =	'is3d_overlayclose';
this.ifp_topboxdiv =		'is3d_topbox';
this.ifp_topboximgdiv =		'is3d_topboximg';
this.ifp_topboxcaptiondiv =	'is3d_topboxcaption';
this.ifp_topboxprevdiv =	'is3d_topboxprev';
this.ifp_topboxclosediv =	'is3d_topboxclose';
this.ifp_topboxnextdiv =	'is3d_topboxnext';

/* Define global variables */
this.image_id =		0;
this.new_image_id =	0;
this.current =		0;
this.target =		0;
this.mem_target =		0;
this.timer =		0;
this.array_images =	[];
this.ifp_slider_width =	0;
this.new_slider_pos =	0;
this.dragging =		false;
this.dragobject =		null;
this.dragx =		0;
this.posx =			0;
this.new_posx =		0;
this.xstep =		150;
this.autorotate = 	'off';
this.rotatestarted = 	'false';
this.top_images =	[];
this.left_images =	[];
this.rotate_images =	[];
//this.array_largerimage =	[];
//this.top_largerimages =	[];


var thisObject = this;
var a = new Array;
var b = new Array;
var c = new Array;
var d = new Array;
var index2 = 0;

/* initialize */
this.init = function(options)
{
	/* Evaluate options */

	var optionsArray = new Array('conf_autorotate', 'conf_autorotatepause', 'conf_startimg', 'conf_nocaptions', 'conf_samewindow');
	var max = optionsArray.length;
	for (var i = 0; i < max; i++)
	{
		var name = optionsArray[i];
		this[name] = (options !== undefined && options[name] !== undefined) ? options[name] : thisObject.defaults[name];
	}
};

/* show/hide element functions */
this.show = function(id)
{
	var element = document.getElementById(id);
	element.style.visibility = 'visible';
};
this.hide = function(id)
{
	var element = document.getElementById(id);
	element.style.visibility = 'hidden';
	element.style.display = 'none';
};

this.step = function() {
	if (thisObject.target < thisObject.current-1 || thisObject.target > thisObject.current+1 ) 
	{
	
		thisObject.moveTo(thisObject.target);
		setTimeout(thisObject.step, 50);
		thisObject.timer = 1;
	} else {
		thisObject.timer = 0;
	}
};



this.glideTo = function(new_image_id) {
	if (this.max <= 1) return;
	var x = (-new_image_id * this.xstep);
	/* Animate gliding to new image */
	this.target = x;
	this.mem_target = x;
	index1=new_image_id;
/*	if (new_image_id = 0){
		index2=1
		}
	*/

if (this.timer == 0)
	{
		window.setTimeout(thisObject.step, 50);
		this.timer = 1;
	}	
	
	
	
	
		this.image_id = new_image_id;
	
			if (new_image_id = 0){
		index2=1
		}		
	
	/* Display new caption */

	var caption = this.img_div.childNodes.item(this.array_images[this.image_id]).getAttribute('alt');

	if (caption == '') { caption = '&nbsp;'; }
	this.caption_div.innerHTML = caption;
	

	
	
this.image_id = new_image_id;
	/* Set scrollbar slider to new position */
	if (this.dragging === false)
	{
	//	this.new_slider_pos = (this.scrollbar_width * (-(x*100/((this.max-1)*this.xstep))) / 100) - this.new_posx;
	//	this.slider_div.style.marginLeft = (this.new_slider_pos - this.ifp_slider_width) + 'px';
	}
	

				
};



this.rotate = function()
{
	/* Do nothing if autorotate has been turned off */
	if (thisObject.autorotate == "on") {
		if (thisObject.image_id >= thisObject.max-1) {
			
			
			thisObject.glideTo(0);
			

		} else {
			thisObject.glideTo(thisObject.image_id+1);


		}
	}
	
	
	if (thisObject.conf_autorotate == 'on') {
	
	
		window.setTimeout (thisObject.rotate, thisObject.conf_autorotatepause);
	}
};



this.moveTo = function(x)
{
	this.current = x;
	var zIndex = this.max;
	
	
	var increase = Math.PI * 2 / this.max;
	var cx = 0, cy = 0, angle =-Math.PI * 2 / 4;	angleB =-Math.PI * 2 / 4;	
	var rad=0;
	
	 O : []; N : 0; S : 0; img : 0; span : 0; xm : 0; ym : 0; nx : 0; ny : 0; nw : 0; nh : 0; 
    cx : 0; cy : 0; zoom : 1; x : 0; y : 0; z : -30000; xt : 0; yt : 0; zt : 0; 
    
 var  pgal_x = 0;
 var  pgal_y = 0;
 var  pgal_z = 0;
 var pgal_xm = 0; 
 var pgal_ym = 0; 
 var pgal_xt = 0; 
 var pgal_yt = 0; 
 var pgal_zt = 0; 
 var pgal_S = 0;      
        
							pgal_nx   = parseFloat(this.images_left); 
        					pgal_ny   = parseFloat(this.images_top); 
        					pgal_nw   = parseFloat(this.images_width); 
        					pgal_nh   = parseFloat(this.images_height); 
        	
        					pgal_zoom = parseFloat(pgal_nh) / 900; 
        					
        					
        
        						
        					
       						 pgal_cx = pgal_nw; 
        						pgal_cy = pgal_nh; 
	
		
	
	
	/* Main loop */
	
	
	for (var index = 0; index < this.max; index++)

	{
		
	
		
			var image = this.img_div.childNodes.item(this.array_images[index]);
		var current_image = index * -this.xstep;

	

			image.style.borderWidth=this.img_div.style.borderWidth;
	
	
			image.style.visibility = 'hidden';
		
 		image.style.width = this.img_div.style.width;
  	
 
  	

			/* Still hide images until they are processed, but set display style to block */
			image.style.display = 'block';
	
		
			/* Set new image properties */

			
			 this.run=function () { 
    	      	  
        pgal_cx += (pgal_xm - pgal_cx) * .1; 
        pgal_cy += (pgal_ym - pgal_cy) * .1; 
        pgal_x  += (pgal_xt - pgal_x)  * .05; 
        pgal_y  += (pgal_yt - pgal_y)  * .05; 
        pgal_z  += (pgal_zt - pgal_z)  * .1; 
     
     		var i = this.max; 
  
     		
     		while (i--) this.anim(); 
     		setTimeout(this.run(), 16);
   		};
    							
    							
        			             	 
             	
             	pgal_N=this.max;
             
             	this.n = index; 
        	
        			
        			this.x = pgal_zoom * Math.random() * pgal_nw * 4 - pgal_nw; 
        			this.y = pgal_zoom * Math.random() * pgal_nh * 4 - pgal_nh; 
             	this.z = Math.round(this.n * (10000 / pgal_N));
             	this.w = parseFloat(image.width); 
      	
        			this.h = parseFloat(image.height); 
        			
        		
        			
                 	 
       this.anim = function() { 

 	

            var f = 700 + this.z - pgal_z; 
           if (f > 0) { 
                var d               = 1000 / f; 
           
         
           var W               = 1.5 * d * this.w * pgal_zoom; 
                var H               = 1.5 * d * this.h * pgal_zoom; 
         
      if  (index % 2 == 0) {
    
      	var X               = pgal_nw; 
      	var X               = 0.92 * (pgal_nw * 0.4 + (pgal_zoom * Math.random() * pgal_nw)); 
      			if (((X + W *3+10)>= pgal_nw ) || (X >= pgal_nw)) {
      						X               = 1 * (pgal_nw - 4.5 * W); 
      	
          			} 
          				if ((X < 0) || ((X - W * .5)<0)) {
      						X               = 1 * (pgal_nw * 0.1 + W * .5); 
          			}  
          			
      	
      	} else {
      
      	  
     							var X               = 1 * (pgal_nw * 0.4 - (pgal_zoom * Math.random() * pgal_nw)); 
      	
      		if ((X < 0) || ((X - W * .5)<0)) {
      								X               = 1 * (pgal_nw * 0.1 + W * .5); 
          			}  
          	
     
      		}
         
			     
         
                var Y               = 1.15 * (pgal_nh * .5 + ((this.y - pgal_y - pgal_cy) * d));
                var W               = 1.5 * d * this.w * pgal_zoom; 
                var H               = 1.5 * d * this.h * pgal_zoom;  
                
            
                		if (((Y + H *3+10)>= pgal_nh ) || (Y >= pgal_nh)) {
                			Y               = 1 * (pgal_nh - 4 * H); 
                			
                			}
                
          
							
								if (index1 == 0 && index2 == 0){
                		a[index]=(X - W * .5);          
                		b[index]=(Y - H * .5);
                		c[index]=(W * 3);
                		d[index]=(H * 3);
                		
             		 	
         
                		 	
                		 	 if (b[index] < 0){
                		 	b[index]=parseFloat(this.images_top)+d[index]+20;
                		 	
                		 	}
                		 	
                		 	
      
              if (((b[index]) > (parseFloat(this.imageflow2_div.offsetTop)+parseFloat(this.imageflow2_div.offsetHeight))) || ((b[index]) > (parseFloat(this.imageflow2_div.offsetHeight))) || ((b[index]+d[index]) > (parseFloat(this.imageflow2_div.offsetHeight))) || ((b[index]+d[index]) > (parseFloat(this.imageflow2_div.offsetTop)+(parseFloat(this.imageflow2_div.offsetHeight))))){  		
                 	b[index]=parseFloat(this.imageflow2_div.offsetTop)+d[index]+20;
                		 	}
                		 	
                		 	 if (b[index] + 2*(parseFloat(image.style.borderWidth)) > this.images_height*0.8){
                		 	b[index]=parseFloat(this.images_top)+d[index]+20;
                		 	
                		 	}
                		 	
             
                
                		
                		 image.style.left       = a[index] + 'px'; 
               		 image.style.top        = b[index] + 'px'; 
               		 image.style.width      = c[index] + 'px'; 
               		 image.style.height     = d[index]+ 'px'; 
               
             
               if (index == index1){
           
 
                 		 image.style.left       = a[index] + 'px'; 
               		 image.style.top        = b[index] + 'px'; 
               		 image.style.width      = c[index] + 'px'; 
               		 image.style.height     = d[index] + 'px'; 
               
         
                }
                else {
                	
       
                			
                		 image.style.left       = a[index] + 'px'; 
               		 image.style.top        = b[index] + 'px'; 
               		 image.style.width      = c[index] + 'px'; 
               		 image.style.height     = d[index]+ 'px'; 
               		 image.style.visibility = 'visible';
               	              	
                    }
                		
                		} else {  
                		
              
                
                if (index == index1){
            
             
                 		 image.style.left       = a[index] + 'px'; 
               		 image.style.top        = b[index] + 'px'; 
        
               		 image.style.visibility = 'hidden';
                }
                else {
                	
                    		 
                		 image.style.left       = a[index] + 'px'; 
               		 image.style.top        = b[index] + 'px'; 
               		 image.style.width      = c[index] + 'px'; 
               		 image.style.height     = d[index]+ 'px'; 
               	 	 image.style.visibility = 'visible';
                	
        
                }
              
             }
         
            } else { 
                this.x  = pgal_zoom * Math.random() * pgal_nw * 3 - pgal_nw; 
                this.y  = pgal_zoom * Math.random() * pgal_nh * 3 - pgal_nh; 
                this.z += 10000; 
          
            } 
        }; 
        
        
        
        
          this.run = function () { 
        pgal_cx += (pgal_xm - pgal_cx) * .1; 
        pgal_cy += (pgal_ym - pgal_cy) * .1; 
        pgal_x  += (pgal_xt - pgal_x)  * .05; 
        pgal_y  += (pgal_yt - pgal_y)  * .05; 
        pgal_z  += (pgal_zt - pgal_z)  * .1; 
        var i = pgal_N; 
        while (i--) this.anim(); 
        setTimeout(this.run, 16); 
    };    
    
      

        this.click = function() { 
            var i = pgal_N; 
   
            if (pgal_S != this) { 
                pgal_xt = this.x; 
                pgal_yt = this.y; 
                pgal_zt = this.z; 
                pgal_S  = this; 
            } else { 
                pgal_S   = 0; 
                pgal_zt += 1600; 
            } 
        } 

            
           this.anim(); 
           this.run();
           this.click();

				
	
			image.style.visibility = 'visible';
	
		

			/* Set image layer through zIndex */
			if ( x < 0 )
			{
				zIndex++;
			} else {
				zIndex = zIndex - 1;
			}
			
			/* Change zIndex, class and onclick function of the focused image */
			switch ( image.i == thisObject.image_id )
			{
				case false:
	
					image.onclick = function() { thisObject.autorotate = "off"; thisObject.glideTo(this.i); return false; };
					image.className = image.className.replace( /(?:^|\s)is3d-centered(?!\S)/g , '' );
					image.onmouseover = function() { thisObject.autorotate = "off"; thisObject.glideTo(this.i); return false; };
				break;

				default:
					zIndex = zIndex + 1;

					var pattern = new RegExp("(^| )" + "is3d-centered" + "( |$)");
					if (!pattern.test(image.className)) image.className += " is3d-centered";

  					if (image.getAttribute("data-style") && (image.getAttribute("data-style") == 'is3d_lightbox')) {
						image.setAttribute("title",image.getAttribute('alt'));
						image.onclick = function () { thisObject.conf_autorotate = "off"; thisObject.showTop(this); return false; };
					} else if (this.conf_samewindow) {
						image.onclick = function() { window.location = this.url; return false; };
						
					} else {
		
						image.onclick = function() { window.open (this.url); return false; };
					}
				break;
			}
			image.style.zIndex = zIndex;
		
	
		x += this.xstep;

}
	
};





/* Main function */
this.refresh = function(onload)
{
	/* Cache document objects in global variables */
	this.imageflow2_div = document.getElementById(this.ifp_imageflow2div);
	this.img_div = document.getElementById(this.ifp_imagesdiv);
	this.scrollbar_div = document.getElementById(this.ifp_scrollbardiv);
	this.slider_div = document.getElementById(this.ifp_sliderdiv);
	this.caption_div = document.getElementById(this.ifp_captionsdiv);

	
	

	/* Cache global variables, that only change on refresh */

	this.images_width = this.imageflow2_div.offsetWidth;

	
	this.images_top = this.imageflow2_div.offsetTop;
	this.images_left = this.imageflow2_div.offsetLeft;
	this.images_rotate = this.imageflow2_div.offsetRotate;
	this.images_height = this.imageflow2_div.offsetHeight;

	
	this.size = this.images_width * 0.5;

	this.max_height =this.images_height;

	/* Change imageflow2 div properties */
	this.imageflow2_div.style.height = this.images_height + 'px';


	/* Change images div properties */
	this.img_div.style.height = this.images_top + 'px';
	
	
	

	

		/* Change captions div properties */
			this.caption_div.style.borderWidth=0;

			this.caption_div.style.width=this.images_width -20 + 'px';	
	
			this.caption_div.style.top=this.images_top + this.images_height + 'px';





	/* Cache EVERYTHING! */
	this.max = this.img_div.childNodes.length;
	
	
	var i = 0;
	for (var index = 0; index < this.max; index++)
	{ 
		var image = this.img_div.childNodes.item(index);

		
		
	
		if ((image.nodeType == 1) && (image.nodeName != "NOSCRIPT"))
		{
			this.array_images[i] = index;

			
			
		if (this.images_height>480)
		{
		
			this.top_images[i] = Math.random()*(this.images_height-280);

		}else
			{
			this.top_images[i] = Math.random()*200
			}
			
				
				if (this.images_width>=480) 
				{
					this.left_images[i] = Math.random()*(this.images_width*1.2);
					if (this.left_images[i]+image.width > this.images_left + this.images_width){
						this.left_images[i] =this.left_images[i] - image.width;
					}	
				} else
					{
						this.left_images[i] = Math.random()*(this.images_width*0.55);
						if (this.left_images[i] > this.images_width)
							{this.left_images[i] = this.left_images[i]-150;}
					}
			
		
			
			this.rotate_images[i]=Math.random()*30-15+'deg';
			/* Set image onclick to glide to this image */
			image.onclick = function() { thisObject.conf_autorotate = "off"; thisObject.glideTo(this.i); return false; };
			image.x_pos = (-i * this.xstep);
			image.i = i;
			
			/* Add width and height as attributes ONLY once onload */
			if (onload === true)
			{
				
				image.w = image.width;
				image.h = image.height;
		
			}

			/* Check source image format */
	
			if ((image.w + 1) > image.h) 
			{
				/* Landscape format */
				image.pc = 118;
			} else {
				/* Portrait and square format */
				image.pc = 100;
			}

			/* Set ondblclick event */
			image.url = image.getAttribute('data-link');
			if (image.getAttribute("data-style") && (image.getAttribute("data-style") == 'is3d_lightbox')) {
				image.setAttribute("title",image.getAttribute('alt'));

				image.ondblclick = function () { thisObject.conf_autorotate = 'off'; thisObject.showTop(this);return false; }
			} else if (this.conf_samewindow) {
				image.ondblclick = function() { window.location = this.url; }
			} else { 
				image.ondblclick = function() { window.open (this.url); }
			}
			/* Set image cursor type */
			image.style.cursor = this.conf_ifp_images_cursor;
			
			


			i++;
		
		}
		
	}
	this.max = this.array_images.length;

	/* Display images in current order */
	if ((this.conf_startimg > 0) && (this.conf_startimg <= this.max))	{
		this.image_id = this.conf_startimg - 1;
		this.mem_target = (-this.image_id * this.xstep);
		this.current = this.mem_target;
	}
	this.moveTo(this.current);
	this.glideTo(this.image_id);
	this.glideTo1(this.image_id);

	/* If autorotate on, set up next glide */
	this.autorotate = this.conf_autorotate;
	if ((this.autorotate == "on") && (this.rotatestarted == "false")) {
		window.setTimeout (thisObject.rotate, thisObject.conf_autorotatepause);
		this.rotatestarted = 'true';
	}

};

this.loaded = function()
{
	if(document.getElementById(thisObject.ifp_imageflow2div))
	{
		if (document.getElementById(thisObject.ifp_overlaydiv) === null) {
			/* Append overlay divs to the page - the overlay is shared by all instances */
			var objBody = document.getElementsByTagName("body").item(0);

			/* -- overlay div */
			var objOverlay = document.createElement('div');
			objOverlay.setAttribute('id',thisObject.ifp_overlaydiv);
			objOverlay.onclick = function() { thisObject.closeTop(); return false; };
			objBody.appendChild(objOverlay);
			jQuery("#"+thisObject.ifp_overlaydiv).fadeTo("fast", .7);
			
	
			/* -- top box div */
			var objLightbox = document.createElement('div');
			objLightbox.setAttribute('id',thisObject.ifp_topboxdiv);
			objBody.appendChild(objLightbox);

			/* ---- image div */
			var objLightboxImage = document.createElement("img");
			//objLightboxImge.onclick = function() { thisObject.closeTop(); return false; };
			objLightboxImage.setAttribute('id',thisObject.ifp_topboximgdiv);
			objLightbox.appendChild(objLightboxImage);

			/* ---- prev link */
			var objPrev = document.createElement("a");
			objPrev.setAttribute('id',thisObject.ifp_topboxprevdiv);
			objPrev.setAttribute('href','#');
			objLightbox.appendChild(objPrev);

			/* ---- next link */
			var objNext = document.createElement("a");
			objNext.setAttribute('id',thisObject.ifp_topboxnextdiv);
			objNext.setAttribute('href','#');
			objLightbox.appendChild(objNext);

			/* ---- caption div */
			var objCaption = document.createElement("div");
			objCaption.setAttribute('id',thisObject.ifp_topboxcaptiondiv);
			objLightbox.appendChild(objCaption);

			/* ---- close link */
			var objClose = document.createElement("a");
			objClose.setAttribute('id',thisObject.ifp_topboxclosediv);
			objClose.setAttribute('href','#');
			objLightbox.appendChild(objClose);

			objClose.onclick = function () { thisObject.closeTop(); return false; };
			objClose.innerHTML = "Close";
		}

		/* hide loading bar, show content and initialize mouse event listening after loading */
		thisObject.hide(thisObject.ifp_loadingdiv);
		thisObject.refresh(true);
		thisObject.show(thisObject.ifp_imagesdiv);
//		thisObject.show(thisObject.ifp_scrollbardiv);
		thisObject.initMouseWheel();
		thisObject.initMouseDrag();
		thisObject.Touch.touch_init();
	//	thisObject.show(thisObject.ifp_largerimagesdiv);
		thisObject.glideTo(this.conf_startimg - 1);
		
	}
};

this.unloaded = function()
{
	/* Fixes the back button issue */
	document = null;
};

/* Handle the wheel angle change (delta) of the mouse wheel */
this.handle = function(delta)
{
	var change = false;
	if (delta > 0)
	{
		if(this.image_id >= 1)
		{
			this.target = this.target + this.xstep;
			this.new_image_id = this.image_id - 1;
			change = true;
		}
	} else {
		if(this.image_id < (this.max-1))
		{
			this.target = this.target - this.xstep;
			this.new_image_id = this.image_id + 1;
			change = true;
		}
	}

	/* Glide to next (mouse wheel down) / previous (mouse wheel up) image */
	if (change === true)
	{
		this.glideTo(this.new_image_id);
		this.autorotate = "off";
	}
};

/* Event handler for mouse wheel event */
this.wheel = function(event)
{
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta)
	{
		delta = event.wheelDelta / 120;
	}
	else if (event.detail)
	{
		delta = -event.detail / 3;
	}
	if (delta) thisObject.handle(delta);
	if (event.preventDefault) event.preventDefault();
	event.returnValue = false;
};

/* Initialize mouse wheel event listener */
this.initMouseWheel = function()
{
	if(window.addEventListener) {
		this.imageflow2_div.addEventListener('DOMMouseScroll', this.wheel, false);
	}
	this.imageflow2_div.onmousewheel = this.wheel;
};

/* This function is called to drag an object (= slider div) */
this.dragstart = function(element)
{
	thisObject.dragobject = element;
	thisObject.dragx = thisObject.posx - thisObject.dragobject.offsetLeft + thisObject.new_slider_pos;

	thisObject.autorotate = "off";
};

/* This function is called to stop dragging an object */
this.dragstop = function()
{
	thisObject.dragobject = null;
	thisObject.dragging = false;
};

/* This function is called on mouse movement and moves an object (= slider div) on user action */
this.drag = function(e)
{
	thisObject.posx = document.all ? window.event.clientX : e.pageX;
	if(thisObject.dragobject != null)
	{
		thisObject.dragging = true;
		thisObject.new_posx = (thisObject.posx - thisObject.dragx) + thisObject.ifp_slider_width;

		/* Make sure, that the slider is moved in proper relation to previous movements by the glideTo function */
		if(thisObject.new_posx < ( - thisObject.new_slider_pos)) thisObject.new_posx = - thisObject.new_slider_pos;
		if(thisObject.new_posx > (thisObject.scrollbar_width - thisObject.new_slider_pos)) thisObject.new_posx = thisObject.scrollbar_width - thisObject.new_slider_pos;
		
	//	var slider_pos = (thisObject.new_posx + thisObject.new_slider_pos);
		var step_width = slider_pos / ((thisObject.scrollbar_width) / (thisObject.max-1));
		var image_number = Math.round(step_width);
		var new_target = (image_number) * -thisObject.xstep;
		var new_image_id = image_number;

		thisObject.dragobject.style.left = thisObject.new_posx + 'px';
		thisObject.glideTo(new_image_id);
	}
};

/* Initialize mouse event listener */
this.initMouseDrag = function()
{
	thisObject.imageflow2_div.onmousemove = thisObject.drag;
	thisObject.imageflow2_div.onmouseup = thisObject.dragstop;

	/* Avoid text and image selection while this.dragging  */
	document.onselectstart = function () 
	{
		if (thisObject.dragging === true)
		{
			return false;
		}
		else
		{
			return true;
		}
	}
};

this.getKeyCode = function(event)
{
	event = event || window.event;
	return event.keyCode;
};


this.Touch = {
	// TOUCH-EVENTS SINGLE-FINGER SWIPE-SENSING JAVASCRIPT
	// Courtesy of PADILICIOUS.COM and MACOSXAUTOMATION.COM
	
	// this script can be used with one or more page elements to perform actions based on them being swiped with a single finger

	triggerElementID : null, // this variable is used to identity the triggering element
	fingerCount : 0,
	startX : 0,
	startY : 0,
	curX : 0,
	curY : 0,
	deltaX : 0,
	deltaY : 0,
	horzDiff : 0,
	vertDiff : 0,
	minLength : 10, // the shortest distance the user may swipe
	swipeLength : 0,
	swipeAngle : null,
	swipeDirection : null,
	
	// The 4 Touch Event Handlers
	
	// NOTE: the touch_start handler should also receive the ID of the triggering element
	// make sure its ID is passed in the event call placed in the element declaration, like:
	// <div id="picture-frame" ontouchstart="touch_start(event,'picture-frame');"  
	//	ontouchend="touch_end(event);" ontouchmove="touch_move(event);" ontouchcancel="touch_cancel(event);">

	touch_init : function() { 
		thisObject.slider_div.ontouchstart = function(event) { thisObject.Touch.touch_start(event,thisObject.ifp_sliderdiv); return false; };
		thisObject.slider_div.ontouchend = function(event) { thisObject.Touch.touch_end(event); return false; };
		thisObject.slider_div.ontouchmove = function(event) { thisObject.Touch.touch_move(event); return false; };
		thisObject.slider_div.ontouchcancel = function(event) { thisObject.Touch.touch_cancel(event); return false; };
	},

	touch_start : function (event,passedName) { 
		this.touch_reset(event);
 
		// disable the standard ability to select the touched object
		event.preventDefault();
		// get the total number of fingers touching the screen
		this.fingerCount = event.touches.length;
		// since we're looking for a swipe (single finger) and not a gesture (multiple fingers),
		// check that only one finger was used
		if ( this.fingerCount == 1 ) {
			// get the coordinates of the touch
			this.startX = event.touches[0].pageX;
			this.startY = event.touches[0].pageY;
			// store the triggering element ID
			this.triggerElementID = passedName;
		} else {
			// more than one finger touched so cancel
			//this.touch_cancel(event);
		}
	},

	touch_move : function (event) { 
		event.preventDefault();
		if ( event.touches.length == 1 ) {
			this.curX = event.touches[0].pageX;
			this.curY = event.touches[0].pageY;
			this.touch_glide(event);
		} else { 
			//this.touch_cancel(event);
		}
	},	
	
	touch_end : function (event) { 
		// clean up at end of swipe
		event.preventDefault(); 
		this.touch_glide(event);
		//this.touch_cancel(event);
	},

	touch_glide : function (event) { 
		// check to see if more than one finger was used and that there is an ending coordinate
		if ( this.fingerCount == 1 && this.curX != 0 ) {
			// use the Distance Formula to determine the length of the swipe
			this.swipeLength = Math.round(Math.sqrt(Math.pow(this.curX - this.startX,2) + Math.pow(this.curY - this.startY,2)));
			// if the user swiped more than the minimum length, perform the appropriate action
			if ( this.swipeLength >= this.minLength ) { 
				this.calculate_angle();
				this.determine_swipe_direction();
				this.processing_routine();
				//this.touch_cancel(event); // reset the variables (nope - process while swiping)
			} else { 
				//this.touch_cancel(event); // nope - process while swiping
			}	
		} else { 
			//this.touch_cancel(event);
		}
	},

	touch_reset : function (event) {
		// reset the variables back to default values
		this.fingerCount = 0;
		this.startX = 0;
		this.startY = 0;
		this.curX = 0;
		this.curY = 0;
		this.deltaX = 0;
		this.deltaY = 0;
		this.horzDiff = 0;
		this.vertDiff = 0;
		this.swipeLength = 0;
		this.swipeAngle = null;
		this.swipeDirection = null;
		this.triggerElementID = null;
	},
	
	calculate_angle : function () {
		var X = this.startX-this.curX;
		var Y = this.curY-this.startY;
		var Z = Math.round(Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))); //the distance - rounded - in pixels
		var r = Math.atan2(Y,X); //angle in radians (Cartesian system)
		this.swipeAngle = Math.round(r*180/Math.PI); //angle in degrees
		if ( this.swipeAngle < 0 ) { this.swipeAngle =  360 - Math.abs(this.swipeAngle); }
	},
	
	determine_swipe_direction : function () {
		if ( (this.swipeAngle <= 45) && (this.swipeAngle >= 0) ) {
			this.swipeDirection = 'left';
		} else if ( (this.swipeAngle <= 360) && (this.swipeAngle >= 315) ) {
			this.swipeDirection = 'left';
		} else if ( (this.swipeAngle >= 135) && (this.swipeAngle <= 225) ) {
			this.swipeDirection = 'right';
		} else if ( (this.swipeAngle > 45) && (this.swipeAngle < 135) ) {
			this.swipeDirection = 'down';
		} else {
			this.swipeDirection = 'up';
		}
	},
	
	processing_routine : function () {
		var swipedElement = document.getElementById(this.triggerElementID);
		if (( this.swipeDirection == 'left' ) || ( this.swipeDirection == 'right' )) {
			var X = Math.round(thisObject.max * (this.curX - thisObject.scrollbar_left)/(thisObject.scrollbar_right - thisObject.scrollbar_left));
			if (X < 0) X = 0;
			if (X >= thisObject.max) X = thisObject.max - 1;
			thisObject.glideTo(X); 
		} 
	}
};

this.getPageScroll = function(){
	var xScroll, yScroll;
	if (self.pageYOffset) {
		yScroll = self.pageYOffset;
		xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop){	 // Explorer 6 Strict
		yScroll = document.documentElement.scrollTop;
		xScroll = document.documentElement.scrollLeft;
	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
		xScroll = document.body.scrollLeft;	
	}
	arrayPageScroll = new Array(xScroll,yScroll) 
	return arrayPageScroll;
};

this.getPageSize = function(){
	var xScroll, yScroll;
	if (window.innerHeight && window.scrollMaxY) {	
		xScroll = window.innerWidth + window.scrollMaxX;
		yScroll = window.innerHeight + window.scrollMaxY;
	} else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
		xScroll = document.body.scrollWidth;
		yScroll = document.body.scrollHeight;
	} else if (document.documentElement.scrollHeight > document.body.offsetHeight){ // IE7, 6 standards compliant mode
		xScroll = document.documentElement.scrollWidth;
		yScroll = document.documentElement.scrollHeight;
	} else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
		xScroll = document.body.offsetWidth;
		yScroll = document.body.offsetHeight;
	}
	var windowWidth, windowHeight;
	if (self.innerHeight) {	// all except Explorer
		if(document.documentElement.clientWidth){
			windowWidth = document.documentElement.clientWidth; 
		} else {
			windowWidth = self.innerWidth;
		}
		windowHeight = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
		windowWidth = document.documentElement.clientWidth;
		windowHeight = document.documentElement.clientHeight;
	} else if (document.body) { // other Explorers
		windowWidth = document.body.clientWidth;
		windowHeight = document.body.clientHeight;
	}
	// for small pages with total height less then height of the viewport
	if(yScroll < windowHeight){
		pageHeight = windowHeight;
	} else { 
		pageHeight = yScroll;
	}
	// for small pages with total width less then width of the viewport
	if(xScroll < windowWidth){	
		pageWidth = xScroll;		
	} else {
		pageWidth = windowWidth;
	}
	arrayPageSize = new Array(pageWidth,pageHeight,windowWidth,windowHeight) 
	return arrayPageSize;
};

this.showFlash = function(){
	var flashObjects = document.getElementsByTagName("object");
	for (i = 0; i < flashObjects.length; i++) {
		flashObjects[i].style.visibility = "visible";
	}
	var flashEmbeds = document.getElementsByTagName("embed");
	for (i = 0; i < flashEmbeds.length; i++) {
		flashEmbeds[i].style.visibility = "visible";
	}
};

this.hideFlash = function(){
	var flashObjects = document.getElementsByTagName("object");
	for (i = 0; i < flashObjects.length; i++) {
		flashObjects[i].style.visibility = "hidden";
	}
	var flashEmbeds = document.getElementsByTagName("embed");
	for (i = 0; i < flashEmbeds.length; i++) {
		flashEmbeds[i].style.visibility = "hidden";
	}
};

this.showTop = function(image)
{
	var topbox_div = document.getElementById(this.ifp_topboxdiv);
	var overlay_div = document.getElementById(this.ifp_overlaydiv);
	var topboximg_div = document.getElementById(this.ifp_topboximgdiv);

	// this.hide flash objects
	this.hideFlash();

	// this.show the background overlay ...
	var arrayPageSize = this.getPageSize();
	overlay_div.style.width = arrayPageSize[0] + "px";
	overlay_div.style.height = arrayPageSize[1] + "px";
	overlay_div.style.display = 'none';
	overlay_div.style.visibility = 'visible';
	jQuery("#"+this.ifp_overlaydiv).show();

	// Get the top box data set up first
	topboximg_div.src = image.url;
	document.getElementById(this.ifp_topboxcaptiondiv).innerHTML = image.getAttribute('title');

	// get the image actual size by preloading into 't'
	var t = new Image();
      t.onload = (function(){	thisObject.showImg(image, t, t.width, t.height); });
	t.src = image.url;

	// Now wait until 't' is loaded
};


this.showImg = function(image, img, img_width, img_height) 
{	
	// Wait for image to preload
	if (img_width == 0 || img_height == 0) {
		img.onload = (function(){ thisObject.showImg(image, img, img.width, img.height); });
		return;
	}

	// Do nothing if the overlay was closed in the meantime
	if (document.getElementById(this.ifp_overlaydiv).style.visibility == 'hidden') return;

	var topbox_div = document.getElementById(this.ifp_topboxdiv);
	var overlay_div = document.getElementById(this.ifp_overlaydiv);
	var topboximg_div = document.getElementById(this.ifp_topboximgdiv);
	var prev_div = document.getElementById(this.ifp_topboxprevdiv);
	var next_div = document.getElementById(this.ifp_topboxnextdiv);
	var caption_div = document.getElementById(this.ifp_topboxcaptiondiv);

	// The image should be preloaded at this point
	topboximg_div.src = image.url;

	// Find previous image that doesn't link to an url
	prev_div.style.visibility = 'hidden';
	if (image.i > 0) {
		for (index = image.i-1; index >= 0; index--) {
			prev_image = this.img_div.childNodes.item(this.array_images[index]);
			if (prev_image.getAttribute("data-style") && (prev_image.getAttribute("data-style") == 'is3d_lightbox')) {
				// Found one - preload and set the previous link
				var p = new Image();
				p.src = prev_image.url;
				prev_div.onclick = (function(){ thisObject.showImg(prev_image, p, p.width, p.height); return false;});
				prev_div.style.visibility = 'visible';
				break;
			}
		} 
	}

	// Find next image that doesn't link to an url
	next_div.style.visibility = 'hidden';
	if (image.i < this.max-1) {
		for (index = image.i+1; index < this.max; index++) {
			next_image = this.img_div.childNodes.item(this.array_images[index]);
			if (next_image.getAttribute("data-style") && (next_image.getAttribute("data-style") == 'is3d_lightbox')) {
				// Found one - preload and set the next link
				var n = new Image();
				n.src = next_image.url;
				next_div.onclick = (function(){ thisObject.showImg(next_image, n, n.width, n.height); return false;});
				next_div.style.visibility = 'visible';
				break;
			} 
		}
	}

	// Size the box to fit the image plus estimate caption height plus some space
	var boxWidth = img_width;
	var boxHeight = img_height + 30;

	topboximg_div.width = boxWidth;	

	// Add description and include its height in the calculations
	var description = '';
	if (image.getAttribute('data-description')) description = image.getAttribute('data-description');
	if (description == image.getAttribute('title')) description = '';
	if (description != '') { description = '<p>' + description + '</p>'; }
	caption_div.innerHTML = image.getAttribute('title') + description;
	if (description != '') {
		jQuery('#'+this.ifp_topboxcaptiondiv).width(boxWidth);	// do this now to estimate the description height
		boxHeight += jQuery('#'+this.ifp_topboxcaptiondiv).height();
	}

	// scale the box if the image is larger than the screen
	var arrayPageSize = this.getPageSize();
	var screenWidth = arrayPageSize[2];
	var screenHeight = arrayPageSize[3];

	var arrayPageScroll = this.getPageScroll();

	if (boxWidth > screenWidth) {
		boxHeight = Math.floor(boxHeight * (screenWidth-100) / boxWidth);
		boxWidth = screenWidth - 100;
		topboximg_div.width = boxWidth;
	}
	if (boxHeight > screenHeight) {
		boxWidth = Math.floor(boxWidth * (screenHeight-100) / boxHeight);
		boxHeight = screenHeight - 100;
		topboximg_div.width = boxWidth;
	}
	jQuery('#'+this.ifp_topboxcaptiondiv).width(boxWidth);

	var xPos = Math.floor((screenWidth - boxWidth) * 0.5) + arrayPageScroll[0];
	var yPos = Math.floor((screenHeight - boxHeight) * 0.5) + arrayPageScroll[1];
	
//	var xPos = Math.floor((screenWidth - boxWidth) * 1) + arrayPageScroll[0];
//	var yPos = Math.floor((screenHeight - boxHeight) *1) + arrayPageScroll[1];


	topbox_div.style.left = xPos + 'px';
	topbox_div.style.top = yPos + 'px';
	topbox_div.style.width = boxWidth + 'px';

	prev_div.style.height = boxHeight + 'px';
	next_div.style.height = boxHeight + 'px';


	// Finally show the topbox...
	topbox_div.style.display = 'none';
	topbox_div.style.visibility = 'visible';
	jQuery("#"+this.ifp_topboxdiv).fadeIn("slow");

};

this.closeTop = function()
{
	//hide the overlay and topbox...
	document.getElementById(this.ifp_overlaydiv).style.visibility='hidden';
	document.getElementById(this.ifp_topboxdiv).style.visibility='hidden';
	document.getElementById(this.ifp_topboxnextdiv).style.visibility='hidden';
	document.getElementById(this.ifp_topboxprevdiv).style.visibility='hidden';

	// this.show hidden objects
	this.showFlash();
};

// Setup
	if(document.getElementById(thisObject.ifp_imageflow2div) === null) { return; }

	/* show loading bar while page is loading */
	thisObject.show(thisObject.ifp_loadingdiv);

	if(typeof window.onunload === "function")
	  {
		var oldonunload = window.onunload;
		window.onunload = function()
		{
			thisObject.unloaded();
			oldonunload();
		};
	} else { 
		window.onunload = this.unloaded; 
	}

	if(typeof window.onload === "function")
	  {
		var oldonload = window.onload;
		window.onload = function()
		{
			thisObject.loaded();
			oldonload();
		};
	} else {
		window.onload = thisObject.loaded;
	}

	/* refresh on window resize */
	window.onresize = function()
	{
		if(document.getElementById(thisObject.ifp_imageflow2div)) { thisObject.refresh(false); }
	};

	document.onkeydown = function(event)
	{
		var charCode  = thisObject.getKeyCode(event);
		switch (charCode)
		{
			/* Right arrow key */
			case 39:
				thisObject.handle(-1);
				break;
		
			/* Left arrow key */
			case 37:
				thisObject.handle(1);
				break;
		}
	};

}
