function loadDoc()
		{
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200)
				{
					myFunction(xhttp);
				}
				else
				{
					// debug :
					console.log("failed");
				}
			}
			xhttp.open("POST", "http://api.openweathermap.org/data/2.5/weather?q=" + city_field.value, true);
			xhttp.send();
		}
		
		function loadRsc()
		{
			var resources = JSON.parse(rsc);
			color_list = resources[0].colors;
			color_size = color_list.length;
			countries = resources[0].countries;
			cardinal_directions = resources[0].directions;
		}
		
		function myFunction(xml)
		{
			var i;
			var xmlDoc = xml.responseText;			
			weather_parser(JSON.parse(xmlDoc));
		}
		
		function weather_parser(json)
		{
			// create a container div for the two sections
			var cont_div = document.createElement("div");
			
			// create a division to hold the info for the city
			var new_div = document.createElement("div");
			cont_div.float = "float";
			
			// get the icon for the weather condition
			var icon_id = json["weather"][0]["icon"];
			
			// the weather condition image
			var w_icon = get_weather_icon(icon_id);
			
			// the country flag image
			var flag = get_flag_icon( (json["sys"]["country"]).toLowerCase() );
			
			// capture main section of the json object
			var main = json["main"];
			
			// String to hold weather presentation
			var weather_string = [];
			
			var country_name = countries[json["sys"]["country"]];
			
			weather_string[0] = "" + json["name"] + "," + country_name ;
			weather_string[1] = json["weather"][0]["description"];
			weather_string[2] = "temperature from " + main["temp_min"] + " to " + 
				main["temp_max"] + String.fromCharCode(176) + "C, wind " + json["wind"]["speed"] + "m/s. clouds " +
				json["clouds"]["all"] + "%, " + main["pressure"] + " hpa" ;
			
			var t = document.createElement("table");
			var t_body = document.createElement("tbody");
			
			// create the row for all information
			var t_row = document.createElement("tr");
			
			// add weather condition icon to the data
			var t_weather = document.createElement("td");
			t_weather.appendChild(w_icon);
			
			// create a row that is adjacent to the weather condition icon
			var t_info_row = document.createElement("td");
			
			// create <b> element to hold bolded location information
			var b_locate = document.createElement("b");
			b_locate.style.color = assign_color();//"OrangeRed";
			b_locate.innerHTML = weather_string[0];
			
			// create <b> element to hold bolded weather description
			var b_weather = document.createElement("b");
			b_weather.innerHTML = "<i>" + weather_string[1] + "</i>";
			
			// create paragraph to hold next line
			var t_para = document.createElement("p");
			
			// create a badge to hold the temperature
			var t_badge = document.createElement("span");
			t_badge.className = "badge";
			t_badge.innerHTML = main["temp"];
			
			t_para.appendChild(t_badge);
			t_para.innerHTML = weather_string[2];
			
			// create paragraph to hold the last line
			var t_para2 = document.createElement("p");
			t_para2.innerHTML = "Geo coords ";
			
			//create a link to maps(Location is also link in original, but we will skip that for now)
			var t_loc_link = document.createElement("a");
			t_loc_link.href = "http://openweathermap.org/"
				+ "/Maps?zoom=12&lat=" + json["coord"]["lat"] + "&lon=" 
				+ json["coord"]["lon"] + "&layers=B0FTTFF";
			t_loc_link.style.color = "DarkBlue";
			t_loc_link.innerHTML = "<b><i>[ " + json["coord"]["lon"] + ", " + json["coord"]["lat"] + " ]<i><b>";
			
			var t_search_term = document.createElement("span");
			t_search_term.className = "p";
			t_search_term.innerHTML = "<b><font color='red'>____________SEARCH TERM : " + document.getElementById("city").value.toUpperCase() + "</font></b>";
			
			t_para2.appendChild(t_loc_link);
			t_para2.appendChild(t_search_term);
			
			t_info_row.appendChild(b_locate);
			t_info_row.appendChild(flag);
			t_info_row.appendChild(b_weather);
			t_info_row.appendChild(t_para);
			t_info_row.appendChild(t_para2);
			
			// increase number of search elements before this section
			search_elements += 1;
			
			// create a column for the extra info button
			var t_info_d = document.createElement("td");
			var t_info_btn = document.createElement("button");
			
			t_info_btn.innerHTML = "<b>EXTRA<br>INFO >><b>";
			t_info_d.appendChild(t_info_btn);
			
			// create a collapsible column to hold extra information
			var t_info_d2 = document.createElement("td");
			
			t_info_d2.id = "collapse_info" + search_elements;
			t_info_d2.style.visibility = "hidden";
			t_info_btn.onclick = function()
			{
				col = document.getElementById(t_info_d2.id);
				if(col.style.visibility == "hidden")
				{
					col.style.visibility = "visible";
					t_info_btn.innerHTML = "<b>LESS<br>INFO <<<b>";
				}
				else
				{
					col.style.visibility = "hidden";
					t_info_btn.innerHTML = "<b>EXTRA<br>INFO >><b>";
				}
			}
			
			// get human readable time for sunset and sunrise
			var sunrise_date = new Date( json.sys.sunrise * 1000);
			var split_sunrise = (sunrise_date.toLocaleString()).split(" ");
			var sunset_date = new Date( json.sys.sunset * 1000);
			var split_sunset = (sunset_date.toLocaleString()).split(" ");
			
			t_info_d2.innerHTML = "<b><u>Wind Direction : " + deg_to_card(json.wind.deg) 
				+ " (" + json.wind.deg + ")<br>Humidity : " + json.main.humidity + " %<br>Sunrise : " 
				+ split_sunrise[1] + " " + split_sunrise[2] + "<br>Sunset : " + split_sunset[1] 
				+ " " + split_sunset[2] + "<br></b>";
			
			// nested addition of content
			t_row.appendChild(t_weather);
			t_row.appendChild(t_info_row);
			t_row.appendChild(t_info_d);
			t_row.appendChild(t_info_d2);
			
			t_body.appendChild(t_row);
			
			t.appendChild(t_body);
			new_div.appendChild(t);
			
			// append the info section to container division
			cont_div.appendChild(new_div);
			
			// append the division to the document
			document.getElementById("content_pane").appendChild(/*new*/cont_div);
		}
		
		function get_weather_icon(icon_id)
		{			
			var img = new Image();
			img.src = "http://openweathermap.org/img/w/" + icon_id + ".png";
			return img;
		}
		
		function get_flag_icon(icon_id)
		{
			var img = new Image();
			img.src = "http://openweathermap.org/images/flags/" + icon_id + ".png";
			return img;
		}
		
		function getCountryName(cod)
		{
			return countries[cod];
		}
		
		/*
		 * @return color for a new search; used to display search response location name
		 * Assume a color_list has been defined
		 * Assume an index is also assigned for iterating through the colors
		 * If index is larger than list range, reset to 0
		*/
		function assign_color()
		{
			if( color_index > color_list.length )
			{
				color_index = 1;
			}
			else
			{
				color_index++;
			}
			return color_list[color_index-1];
		}/**/
		
		/*
		 * Get the cardinal wind direction from degrees
		*/
		function deg_to_card(deg)
		{
			var i = Math.floor( (deg + 11.25)/22.5 );
			return cardinal_directions[i % 16];
		}