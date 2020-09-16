window.onload = function(){

  var config = {
    date_month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    data_colors:[]
  }



  var data = {
    data_items_count:5,
    data_days_count: 30,
    data_max_value:100,
    data_min_value:0,
    data_render: [],
    data_generate: function(){
      var date = new Date();
      document.getElementById('n-day-title').innerHTML = date.getDate()+' '+config.date_month[date.getMonth()]
      date.toISOString()

      var data_item = [];

      for (var i = 0; i < this.data_items_count; i++) {
        date = new Date();
        data_item[i] = {id:i,title:'item '+i,data:[],max_value:0,min_value:0}
        for (var j = 0; j < this.data_days_count; j++) {
          date.setDate(date.getDate()+1)
          var value = Math.floor(Math.random() * (this.data_max_value-this.data_min_value) + this.data_min_value)

          if(j == this.data_days_count-1){
            /* Hours */
            for (var k = 0; k < 24; k++) {
              var new_time = k;
              if(new_time < 10) new_time = '0'+new_time
              var value = Math.floor(Math.random() * (this.data_max_value-this.data_min_value) + this.data_min_value)
              data_item[i].data[j+k] = {date:date.getFullYear()+'-'+('0'+date.getMonth()).slice(-2)+'-'+('0'+date.getDate()).slice(-2)+'T'+new_time+':00',value:value};
            }

          }else{
            data_item[i].data[j] = {date:date.getFullYear()+'-'+('0'+date.getMonth()).slice(-2)+'-'+('0'+date.getDate()).slice(-2)+'T00:00',value:value}
          }
        }

        data_item[i].max_value = Math.max.apply(Math,data_item[i].data.map(function(item){
          return item.value;
        }))
        data_item[i].min_value = Math.min.apply(Math,data_item[i].data.map(function(item){
          return item.value;
        }))

        config.data_colors.push('hsl('+Math.floor(Math.random()*('350'))+' 100% 70% / 1)')

      }

      return data_item;

    }
  }

  var data_init = data.data_generate()
  var items = {
    active_item: 0,
    items: function(){
      var list_items_navigation = document.getElementById('list-items-navigation');
      for (var i = 0; i < data.data_items_count; i++) {
        var list_item = document.createElement('div');
        list_item.setAttribute('id',data_init[i].id);
        list_item.setAttribute('class','list-item');
        list_item.innerHTML = 'item ' + data_init[i].id;
        if(i == 0) list_item.classList.add('active');
        list_item.onclick = e => this.items_click(e.target)
        list_items_navigation.append(list_item)
      }
    },
    items_click:function(e){

      document.querySelectorAll('.list-item').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.data-content-container').forEach(item => item.classList.remove('active'));
      e.classList.add('active')
      document.getElementsByClassName('data-content-container')[e.id].classList.add('active')

      items.active_item = e.id;

      graph.render_graph(items.active_item);
      filters.filters_create(items.active_item)
    }
  }
  var range = {
    data_range: ['day','week','month'],
    data_range_active: 'day',
    data_count: 24,
    range_items: function(){
      var range_items = document.getElementById('range-items');
      for (var i = 0; i < this.data_range.length; i++) {
        var range_item = document.createElement('div');
        range_item.setAttribute('id',this.data_range[i]);
        range_item.setAttribute('class','mg-navigation-item');
        if(i == 0) range_item.classList.add('active');
        range_item.innerHTML = this.data_range[i];
        range_item.onclick = e => this.range_items_click(e.target)
        range_items.append(range_item)
      }
    },
    range_items_click: function(e){

      document.querySelectorAll('.mg-navigation-item').forEach(item => item.classList.remove('active'));
      e.classList.add('active')

      document.getElementById('animate').classList.add('active');

      setTimeout(function () {

        range.data_range_active = e.id;
        range.data_range_change()
        graph.render_viewport_grid()
        graph.render_graph(items.active_item);
        graph.render_items(filters.filter_active_items);
        donut.donut_data();
        donut.donut_change_render();
        data_content.data_content_render();
        document.getElementById('animate').classList.remove('active');

      }, 1000);



    },
    data_range_change: function(){
      switch (this.data_range_active){
        case 'day':
          this.data_count = 24;
          this.data_new_array(this.data_count)
          break;
        case 'week':
          this.data_count = 7;
          this.data_new_array(this.data_count)
          break;
        case 'month':
          this.data_count = 30;
          this.data_new_array(this.data_count)
          break;
        default:
          data_count = 24;
      }
    },
    data_new_array: function(data_count){
      if(data_count){
        if(this.data_range_active == 'day'){
          data.data_render = []
          var new_data_id = 0
          for (var i = 0; i < data.data_items_count; i++) {
            var new_data_items = [];
                new_data_id = data_init[i].id,
                new_data_title = data_init[i].title;
            for (var j = 0; j < this.data_count; j++) {
              new_data_items.push(data_init[i].data[data_init[i].data.length-data_count+j])
            }
            var new_data = {
              id:new_data_id,
              title:new_data_title,
              data:new_data_items,
              min:Math.min.apply(Math,new_data_items.map(function(i){return i.value})),
              max:Math.max.apply(Math,new_data_items.map(function(i){return i.value}))
            }
            data.data_render.push(new_data)
          }
        }
        else if(this.data_range_active == 'week'){
          data.data_render = []
          var new_data_id = 0
          for (var i = 0; i < data.data_items_count; i++) {
            var new_data_items = [];
                new_data_id = data_init[i].id,
                new_data_title = data_init[i].title;
            for (var j = 0; j < this.data_count; j++) {
              new_data_items.push(data_init[i].data[data_init[i].data.length-24-data_count+j])
            }
            var new_data = {
              id:new_data_id,
              title:new_data_title,
              data:new_data_items,
              min:Math.min.apply(Math,new_data_items.map(function(i){return i.value})),
              max:Math.max.apply(Math,new_data_items.map(function(i){return i.value}))
            }
            data.data_render.push(new_data)
          }
        }
        else if(this.data_range_active == 'month'){
          data.data_render = []
          var new_data_id = 0
          for (var i = 0; i < data.data_items_count; i++) {
            var new_data_items = [];
                new_data_id = data_init[i].id,
                new_data_title = data_init[i].title;
            for (var j = 0; j < this.data_count; j++) {
              new_data_items.push(data_init[i].data[j])
            }
            var new_data = {
              id:new_data_id,
              data:new_data_items,
              title:new_data_title,
              min:Math.min.apply(Math,new_data_items.map(function(i){return i.value})),
              max:Math.max.apply(Math,new_data_items.map(function(i){return i.value}))
            }
            data.data_render.push(new_data)
          }
        }
      }

    },
    range_update_data: function(new_data){
      graph.render_graph(active_item);
    }
  }

  var filters = {
    filter_items: [],
    filter_active_items: [],
    filter_created: 0,
    filters_create: function(id){

      var filters_item_class = document.getElementsByClassName('filters-item');
      if(this.filter_created == 1){

        for (var j = 0; j < data.data_items_count-1; j++) {
          filters_item_class[0].remove()
        }

      }

      var list_filters = document.getElementById('filters');
      var filters_item;

      for (var i = 0; i < data.data_items_count; i++) {
        if(i != id){
          this.filter_items.push(i)
          filters_item = document.createElement('div');
          filters_item.setAttribute('id',data.data_render[i].id);
          filters_item.setAttribute('class','filters-item filter-'+i);

          filters_item.onclick = function() {

            console.log(this.id)

            if(filters.filter_active_items.indexOf(Number(this.id)) == -1){
              filters.filter_active_items.push(Number(this.id))
            }else{
              filters.filter_active_items.splice(filters.filter_active_items.indexOf(Number(this.id)),1)
            }

            this.classList.toggle('active');
            graph.render_items(filters.filter_active_items);
          }

          filters_item.innerHTML = '<span class="filter-color" style="background-color:'+config.data_colors[i]+'"></span><div class="filter-title">item '+data.data_render[i].id+'</div>';
          list_filters.append(filters_item)

          var active_item = filters.filter_active_items.indexOf(i)
          if(active_item >= 0){
            document.getElementsByClassName('filter-'+filters.filter_active_items[active_item])[0].classList.add('active');
          }
        }
      }
      this.filter_created = 1;
      return graph.render_items(this.filter_active_items);
    }
  }

  var main_viewport = document.getElementById('main-graph');
  var chart_x = 50;
  var chart_y = 25;
  var width = main_viewport.getBoundingClientRect().width;
  var height = main_viewport.getBoundingClientRect().height;
  var graph_width = width-chart_x;
  var graph_height = height-chart_y;
  var graph = {
    x:0,
    y:0,
    chart_x: 50,
    chart_y: 25,
    width: width,
    height:height,
    graph_width: graph_width,
    graph_height: graph_height,
    render_viewport_xy: function(){

      main_viewport.setAttribute('viewBox','0 0 '+this.width+' '+this.height)
      var g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','coordinates')
      var x = document.createElementNS('http://www.w3.org/2000/svg','path')
      var y = document.createElementNS('http://www.w3.org/2000/svg','path')
      x.setAttribute('d','M'+this.chart_x+' '+this.graph_height+' L'+this.width+' '+this.graph_height)
      y.setAttribute('d','M'+this.chart_x+' 0 L'+this.chart_x+' '+this.graph_height)
      g.append(x,y)
      main_viewport.append(g)},
    render_viewport_grid: function(range_data){
      range_data = range.data_range_active
      var viewport_grid = document.getElementById('viewport-grid');
      if(viewport_grid){
          viewport_grid.remove()
      }
      var rv_grid_y;
      var day_data = 0;
      var grid_xy = document.createElementNS('http://www.w3.org/2000/svg','g');
      grid_xy.setAttribute('class','viewport_coordinates_xy')
      grid_xy.setAttribute('id','viewport-grid')
      var grid_x = document.createElementNS('http://www.w3.org/2000/svg','path');
      var day_data_length;

      if(range_data == 'day'){
        rv_grid_y = 12;
      }else if(range_data == 'week'){
        rv_grid_y = 7;
      }else if(range_data == 'month'){
        rv_grid_y = 15;
      }

      var grid_x_step = this.graph_width/rv_grid_y;
      var grid_x_path_step = this.chart_x;
      var grid_x_data_text;


      for (var i = 0; i < rv_grid_y; i++) {

        var grid_x

        if(range_data == 'day'){
          var data_time = '0'+i*2;
          grid_x_data_text = data_time.slice(-2)+':00';
        }else if(range_data == 'week'){
          var week_data_item = data.data_render[items.active_item].data[i]
          grid_x_data_text = week_data_item.date.slice(5,10);
        }else if(range_data == 'month'){
          var month_data_item = data.data_render[items.active_item].data[i*2]
          grid_x_data_text = month_data_item.date.slice(5,10);
        }

        if(i == 0){
          grid_x_path_step = this.chart_x;
        }else{
          grid_x_path_step += grid_x_step;
          grid_x = document.createElementNS('http://www.w3.org/2000/svg','path');
          grid_x.setAttribute('d','M'+grid_x_path_step+' 0 L'+grid_x_path_step+' '+this.graph_height)
          grid_xy.append(grid_x);
        }

        var grid_x_text = document.createElementNS('http://www.w3.org/2000/svg','text');

        grid_x_text.setAttribute('x',grid_x_path_step)
        grid_x_text.setAttribute('y',this.height-2)
        grid_x_text.innerHTML = grid_x_data_text

        grid_xy.append(grid_x_text);
      }

      var grid_y_step = this.graph_height/5;
      var grid_y_path_step = this.chart_y;

      for (var i = 0; i < 5; i++) {
        var grid_y

        if(i == 0){
          grid_y_path_step = 0;
        }else{
          grid_y_path_step += grid_y_step;
          grid_y = document.createElementNS('http://www.w3.org/2000/svg','path');
          grid_y.setAttribute('d','M'+this.chart_x+' '+grid_y_path_step+' L'+this.width+' '+grid_y_path_step)
          grid_xy.append(grid_y);
        }
      }

    render_data = day_data;
    main_viewport.prepend(grid_xy)

    },
    render_graph: function(id){
      var viewport_coordinates = document.getElementById('viewport-coordinates')
      if(viewport_coordinates){
        viewport_coordinates.remove()
      }

      var content_data = data.data_render[items.active_item].data;
      var g_data_coordinates = document.createElementNS('http://www.w3.org/2000/svg','g');
      g_data_coordinates.setAttribute('class','data-coordinates')
      g_data_coordinates.setAttribute('id','viewport-coordinates')

      var data_step = this.graph_width/range.data_count
      var data_path_item = document.getElementById('main-path')

      var data_path
      if(!data_path_item){
        data_path = document.createElementNS('http://www.w3.org/2000/svg','path');
        data_path.setAttribute('id','main-path')
      }

      var data_path_start
      var data_path_points;
      var data_path_array = []

      for (var i = 0; i < range.data_count; i++) {
        if(i == 0){
          var data_path_x_step = this.chart_x;
        }else{
          data_path_x_step += data_step
        }

        if(content_data[i].value != 0){
          data_path_points = 'L'+data_path_x_step+' '+content_data[i];
          var data_path_y_step = Math.floor(content_data[i].value*this.graph_height)/data.data_max_value
        }else{
          data_path_y_step = 0
        }

        data_path_y_step = this.graph_height-data_path_y_step


        if(i > 0){
          data_path_points = 'L'+data_path_x_step+' '+data_path_y_step;
        }else{
          data_path_points = 'M'+data_path_x_step+' '+data_path_y_step;
        }

        data_path_array.push(data_path_points)


        var data_point = document.createElementNS('http://www.w3.org/2000/svg','circle');
        var data_text = document.createElementNS('http://www.w3.org/2000/svg','text');

        data_point.setAttribute('cx',data_path_x_step)
        data_point.setAttribute('cy',data_path_y_step)
        data_point.setAttribute('r','2')
        data_point.style.fill =  "#fff";



        data_point.setAttribute('class','data-point')
        data_text.setAttribute('x',data_path_x_step+10)
        data_text.setAttribute('y',data_path_y_step)
        data_text.innerHTML = content_data[content_data.length-range.data_count+i].value;

        g_data_coordinates.append(data_point,data_text)
      }
      /* FOR STYLE Z FOR LAST ELEMENT*/
      data_path_l_item = 'L'+this.width+' '+this.graph_height;
      /* FOR STYLE */
      //data_path_array.push(data_path_l_item)
      if(!data_path_item){
        main_viewport.append(data_path)
      }
      main_viewport.append(g_data_coordinates)
      this.graph_data = data_path_array;
      this.render_graph_change()
},
    render_graph_change:function(id){
      var main_path = document.getElementById('main-path'); /* WORK */
      main_path.setAttribute("style","d: path('"+this.graph_data+"');stroke:"+config.data_colors[items.active_item]+"")
      main_path.setAttribute("fill","url(#g1)")
    },
    render_items: function(id){

      var all_graphs = document.getElementById('all-graphs')
      if(all_graphs){
        all_graphs.remove()
      }

      var g
      if(!document.getElementById('all-graphs')){
        g = document.createElementNS('http://www.w3.org/2000/svg','g');
        g.setAttribute('id','all-graphs')
        main_viewport.append(g)
      }

      var a_g = document.getElementById('all-graphs')
      console.log(id,items.active_item)
      for (var i = 0; i < id.length; i++) {
          var path = document.getElementById('path-'+id[i])
          if(id[i] != items.active_item){


          if(!path){
            var path = document.createElementNS('http://www.w3.org/2000/svg','path');
            path.setAttribute('id','path-'+id[i])
            path.setAttribute('class','other-item')
          }

          a_g.append(path)
        }
      }

      /* FULL DATA 5 items - active item max and min value */

      for (var i = 0; i < filters.filter_active_items.length; i++) {

        if(id[i] != items.active_item){

        var new_data = data.data_render[filters.filter_active_items[i]].data
        var data_step = this.graph_width/range.data_count
        var data_path_array = []

        for (var j = 0; j < new_data.length; j++) {

          if(j == 0){
            var data_path_x_step = this.chart_x;
          }else{
            data_path_x_step += data_step
          }

          if(new_data[j].value != 0){
            data_path_points = 'L'+data_path_x_step+' '+new_data[j].value;
            var data_path_y_step = Math.floor((new_data[j].value*this.graph_height)/data.data_max_value)
          }else{
            data_path_y_step = 0
          }

          data_path_y_step = this.graph_height-data_path_y_step

          if(j > 0){
            data_path_points = 'L'+data_path_x_step+' '+data_path_y_step;
          }else{
            data_path_points = 'M'+data_path_x_step+' '+data_path_y_step;
          }


          data_path_array.push(data_path_points)

        }

        var path_item = document.getElementById('path-'+data.data_render[filters.filter_active_items[i]].id)
        path_item.setAttribute("style","d: path('"+data_path_array+"');stroke:"+config.data_colors[data.data_render[filters.filter_active_items[i]].id]+"")

        if(filters.filter_active_items[i] != items.active_item){
          path_item.style.opacity = "0.25";
        }

      }

      }

    },
  }
  var data_content = {
    data_content_render: function(){
      var data_content_items = document.getElementById('data-content');
      var data_item_container = document.getElementById('data-content-container')

        data_content_items.innerHTML = ''

      for (var i = 0; i < data.data_items_count; i++) {

        var data_item_container = document.createElement('div')
        var data_item = document.createElement('div')
        var data_item_title = document.createElement('div')

            data_item_container.setAttribute('class','data-content-container')
            data_item_title.setAttribute('class','data-content-item-title')
            if(i == items.active_item) data_item_container.classList.add('active')
            data_item_title.innerHTML = 'item '+i;
            data_item.setAttribute('class','data-container-item')
            data_item.setAttribute('id','data-container-item-'+i)

            for (var j = 0; j < data.data_render[i].data.length; j++) {
              data_item.innerHTML += '<div class="data-content-item"><span>'+data.data_render[i].data[j].date.replace('T',' ')+'</span><span>'+data.data_render[i].data[j].value+'</span></div>'
            }

            data_item_container.append(data_item_title,data_item)
            data_content_items.append(data_item_container)
      }
    }
  }
  var donut = {
    max_value_data: [],
    donut_data: function(){
      var donut_data = document.getElementById('donut-data');
      donut_data.innerHTML = ''
      this.max_value_data = [];
      data.data_render.map(function(item){
        donut.max_value_data.push(item.max)
        donut_data.innerHTML +='<div class="donut-item"><span class="donut-item-title">'+item.title+' MAX</span><span class="donut-item-value">'+item.max+'</span></div>';
      })
    },
    donut_render: function(){

      this.donut_data()
      var donut = document.getElementById('donut')

      var width = donut.getBoundingClientRect().width;
      var height = donut.getBoundingClientRect().height;
          donut.setAttribute('viewBox','0 0 '+width+' '+height),
          max_data = this.max_value_data.reduce((a,b) => a+b,0)
          console.log(max_data)
          var dash_offset = 0;

      for (var i = 0; i < data.data_items_count; i++) {
        var donut_circle = document.createElementNS('http://www.w3.org/2000/svg','circle')

        var r = 65
        var dash_array = 2*Math.PI*r
        var dash_item = (data.data_render[i].max/max_data)*dash_array;
            if(i>0){
              dash_offset = dash_offset - (data.data_render[i-1].max/max_data)*dash_array;
              //dash_offset = dash_offset - dash_item;
            }else{
              dash_offset = 0;
            }

            donut_circle.setAttribute('class','donut-circle')
            donut_circle.setAttribute('id','donut-circle-'+i)
            donut_circle.setAttribute('cx',width/2)
            donut_circle.setAttribute('cy',height/2)
            donut_circle.setAttribute('r',r)
            donut_circle.setAttribute('stroke',config.data_colors[i])
            donut_circle.setAttribute('stroke-width','10')
            donut_circle.setAttribute('fill','transparent')
            donut_circle.style.strokeDasharray = dash_item+' '+dash_array
            donut_circle.style.strokeDashoffset = dash_offset
            donut.append(donut_circle)
      }
    },
    donut_change_render: function(){
      for (var i = 0; i < data.data_items_count; i++) {
        var donut_circle = document.getElementById('donut-circle-'+i)
        var r = 65;
        var dash_array = 2*Math.PI*r
        max_data = this.max_value_data.reduce((a,b) => a+b,0)
        var dash_item = (data.data_render[i].max/max_data)*dash_array;
            if(i>0){
              dash_offset = dash_offset - (data.data_render[i-1].max/max_data)*dash_array;
            }else{
              dash_offset = 0;
            }
            donut_circle.style.strokeDasharray = dash_item+' '+dash_array
            donut_circle.style.strokeDashoffset = dash_offset
      }
    }
  }

  /* INIT */

  function generate(){
    items.items();
    range.range_items();
    range.data_range_change();
    filters.filters_create(items.active_item)
    graph.render_viewport_xy()
    graph.render_viewport_grid()
    graph.render_graph()
    data_content.data_content_render()
    donut.donut_render();
  }

  generate()

  /* STYLES */

}
