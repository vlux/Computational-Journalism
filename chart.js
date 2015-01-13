
        var chart_width = 1340;
		var chart_height = 450;
        var sign = 2;            //sign = 2 mouseover to show

            d3.json("film.json",function(error,data){

            var color_hash = [
                "#74bab8",
                "#e4a032",
                "#ad5252",
                "#bb60a4",
                "#0a0a0a",
                "#f61747"
            ]

            var color_hash2 = [
                "#57ece7",
                "#e4a032",
                "#ffb6b6",
                "#f8cbf2",
                "#adaaaa",
                "#f61747"
            ]

            var category = ["Dialogue", "Fight", "Motion", "Credits","All"];
            var roma = ['I','II','III','IV','V','VI'];

            var svg = d3.select("#chart").append("svg")
                                        .attr('width',chart_width)
                                        .attr('height',chart_height);

            //Title
            var legend_tabs = [300, 450, 600, 750,900];
            var legend = svg.append("g")
                .selectAll(".legend")
                .data(category)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(" + legend_tabs[i] + ",35)"; });

            legend.append("rect")
                .attr("x", 0)
                .attr("width", 20)
                .attr("height", 20)
                .style("fill", function(d,i){
                    if(i > 0)
                        return color_hash[ i + 1];
                    if(i == 0)
                        return color_hash[i];
                })
                .on('mouseover',function(d,i){
                    d3.select(this)
                      .style('cursor','pointer');
                    if(i == 0)
                        hightlight(i + 1);
                    if(i > 0 && i < 4)
                        hightlight(i + 2);
                })
                .on('mouseout',function(){
                    rehighlight();
                })
                .on('click',function(d,i){
                    if(i == 0)
                        redraw(i + 1);
                    if(i > 0)
                        redraw(i + 2);
                    if(i == 4)
                        redraw(10);
                });

            legend.append("text")
                .attr("x", 30)
                .attr("y", 10)
                .attr("dy", ".35em")
                .style("text-anchor", "begin")
                .style("font" ,"18px  Microsoft Yahei")
                .style('font-weight',600)
                .style('fill','#fff')
                .text(function(d) { return d; })
                .on('mouseover',function(d,i){
                    d3.select(this)
                      .style('cursor','pointer')
                      .style('fill',function(){
                          if(i > 0)
                              return color_hash[ i + 1];
                          if(i == 0)
                              return color_hash[i];
                      });

                      if(i == 0)
                          hightlight(i + 1);
                      if(i > 0 && i < 4)
                          hightlight(i + 2);
                })
                .on('mouseout',function(){
                    d3.select(this)
                      .style('fill','#fff');
                    rehighlight();
                })
                .on('click',function(d,i){
                    if(i == 0)
                        redraw(i + 1);
                    if(i > 0)
                        redraw(i + 2);
                    if(i == 4)
                        redraw(10);
                });




            var redraw = function(k){

                svg.selectAll('.rects').remove();

                data.forEach(function(d,i){

                    if(k != 10)
                        sign = 1;
                    if(k == 10)
                        sign = 2;

                    var group = svg.append('g')
                           .attr("class","rects")
                           .selectAll("rect")
                           .data(d)
                           .enter();

                    var Xlen = 40;
                    var filmlen = 0,filmmin = 0;
                    var partlen = 0,partmin = 0;

                    if(k!=10)
                        for(var j = 0; j < d.length; j++)
                            if(d[j].type == k){
                                partmin += d[j].len;
                                partlen += d[j].len * 10;
                            }
                    if(k == 10)
                        for(var j = 0;j < d.length; ++j){
                            filmmin += d[j].len;
                            filmlen += d[j].len * 10;
                        }

                    var forlength = k==10 ? d.length : 1;

                    for(var j = 0; j < forlength; ++j){
                       group.append("rect")
                            .transition()
        			        .duration(1000)
        			        .ease("linear")
                           .attr("x",function(){
                               return Xlen;
                           })
                           .attr("y",function(){
                                return i * 60 + 100;
                           })
                           .attr("width",function(){
                                if(k==10)
                                    return d[j].len * 10;
                                else
                                    return partlen;
                           })
                           .attr("height",20)
                           .attr("fill",function(){
                               if(k == 10)
                                   return color_hash[d[j].type-1];
                               else
                                   return color_hash[k-1];
                           });

                        Xlen += d[j].len * 10;
                   }

                   svg.append('text')
                       .attr('x',15)
                       .attr('y',function(){
                           return 115 + i * 60;
                       })
                       .attr('class','filmname')
                       .text(function(){
                           return roma[i];
                       })

                   group.append('text')
                       .attr('x',function(){
                           if(k == 10)
                               return filmlen + 50
                           else
                               return partlen + 50
                       })
                       .attr('y',function(){
                           return 115 + i * 60;
                       })
                       .attr('class','filmtime')
                       .text(function(){
                          if(k == 10)
                              return filmmin +'mins'
                          else
                              return 'Part : ' + partmin +'mins'
                       })

                })
            }

            redraw(10);

            var hightlight = function(k){

                if(sign == 2){
                    svg.selectAll('.filmtime').remove();

                    data.forEach(function(d,i){
                        var group = svg.append('g')
                               .attr("class","rects")
                               .selectAll("rect")
                               .data(d)
                               .enter();

                        var Xlen = 40;
                        var filmlen = 0,filmmin = 0;
                        var partlen = 0,partmin = 0;

                        for(var j = 0; j < d.length; j++)
                            if(d[j].type == k){
                                partmin += d[j].len;
                                partlen += d[j].len * 10;
                            }
                        for(var j = 0;j < d.length; ++j){
                                filmmin += d[j].len;
                                filmlen += d[j].len * 10;
                            }

                        for(var j = 0; j < d.length; ++j){
                           group.append("rect")
                            //    .transition()
                            //    .duration(1000)
                            //    .ease("linear")
                               .attr("x",function(){
                                   return Xlen;
                               })
                               .attr("y",function(){
                                    return i * 60 + 100;
                               })
                               .attr("width",function(){
                                        return d[j].len * 10;
                               })
                               .attr("height",20)
                               .attr("fill",function(){
                                   if(d[j].type == k)
                                       return color_hash2[d[j].type-1];
                                   else
                                       return color_hash[d[j].type-1];
                               })
                            Xlen += d[j].len * 10;
                       }

                        group.append('text')
                            .attr('x',function(){
                                return filmlen + 50
                            })
                            .attr('y',function(){
                                return 115 + i * 60;
                            })
                            .attr('class','filmtime2')
                            .text(function(){
                                  return partmin +'/' + filmmin + "mins";
                            })
                    })
                }
            }

            var rehighlight = function(){
                if(sign == 2){
                    svg.selectAll('.filmtime2').remove();

                    data.forEach(function(d,i){
                        var group = svg.append('g')
                               .attr("class","rects")
                               .selectAll("rect")
                               .data(d)
                               .enter();

                        var Xlen = 40;
                        var filmlen = 0,filmmin = 0;

                        for(var j = 0;j < d.length; ++j){
                                filmmin += d[j].len;
                                filmlen += d[j].len * 10;
                            }

                        for(var j = 0; j < d.length; ++j){
                           group.append("rect")
                               .attr("x",function(){
                                   return Xlen;
                               })
                               .attr("y",function(){
                                    return i * 60 + 100;
                               })
                               .attr("width",function(){
                                        return d[j].len * 10;
                               })
                               .attr("height",20)
                               .attr("fill",function(){
                                       return color_hash[d[j].type-1];
                               })
                            Xlen += d[j].len * 10;
                       }

                        group.append('text')
                            .attr('x',function(){
                                return filmlen + 50
                            })
                            .attr('y',function(){
                                return 115 + i * 60;
                            })
                            .attr('class','filmtime')
                            .text(function(){
                               return filmmin +'mins'
                            })
                    })
                }
            }
    })
