/*
Load from local files are prevented by flash, allow exceptions at:
http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html
http://pbskids.org/scripts/soundmanager2/doc/getstarted/
*/

$(document).ready(function () {
  
  var soundsArray = null;
  var row = 7;
  var column = 10;
  
  
  soundManager.setup({
    url: 'swfs/', 
    flashVersion: 9, 
    useFastPolling: true, 
    useHighPerformance: true, 
    //debugMode: true, 
    //debugFlash: true, 
    onready: function () {
      
      soundManager.createSound({
        id: 'sound_0', 
        url: 'audios/Grand Piano - Fazioli - major C middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_1', 
        url: 'audios/Grand Piano - Fazioli - major D middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_2', 
        url: 'audios/Grand Piano - Fazioli - major E middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_3', 
        url: 'audios/Grand Piano - Fazioli - major F middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_4', 
        url: 'audios/Grand Piano - Fazioli - major G middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_5', 
        url: 'audios/Grand Piano - Fazioli - major A middle.wav'
      }).load();
      
      soundManager.createSound({
        id: 'sound_6', 
        url: 'audios/Grand Piano - Fazioli - major B middle.wav'
      }).load();
      
      soundsArray = [];
      for (var i = 0; i < row; i++) {
        soundsArray.push('sound_' + i);
        //console.log('sound_' + i);
      }
      
      setInterval(appView.nextInterval, 500);
      
    }
  });
  
  
  var Indicator = Backbone.Model.extend ({
    
    defaults: {
      graphic: null
    }, 
    
    initialize: function () {
      
      
    }
    
  });
  
  
  var Indicators = Backbone.Collection.extend ({
    
    model: Indicator
    //indicators: null,
    
  });
  
  
  var Button = Backbone.Model.extend ({
    
    defaults: {
      enabled: false, 
      graphic: null
    }, 
    
    initialize: function () {
      
      
    }
    
  });
  
  
  var Buttons = Backbone.Collection.extend ({
    
    //model: Button, 
    buttons: null, 
    
    initialize: function (row, column) {
      
      this.buttons = new Array(row);
      for (var i = 0; i < row; i++) {
        this.buttons[i] = new Array(column);
        for (var j = 0; j < column; j++) {
          this.buttons[i][j] = new Button();
        }
      }
    }, 
    
    getButton: function (row, column) {
      
      return this.buttons[row][column];
    }
    
    
  });
  
  
  var AppView = Backbone.View.extend ({
    
    initialize: function () {
      
      this.row = row;
      this.column = column;
      this.indicators = new Indicators();
      for (var i = 0; i < this.column; i++) {
        this.indicators.add(new Indicator());
      }
      this.buttons = new Buttons(row, column);
      this.currentColumn = 0;
      
      _.bindAll(this, 'nextInterval', 'layerClickHandler');
      
      var stage = new Kinetic.Stage({
        container: 'drumMachinediv', 
        height: 595, 
        width: 800
      });
      
      var layer = new Kinetic.Layer();
      layer.on('click', this.layerClickHandler);
      
      this.createButtonsToLayer(layer)
  
  
      //layer.add(rect);
      this.graphicsLayer = layer;
      stage.add(layer);
  
    }, 
    
    
    layerClickHandler: function (event) {
      
      var shape = event.targetNode;
      
      /* set to not enabled */
      if (this.buttons.getButton(shape.getAttrs()['row'], shape.getAttrs()['column']).get('enabled')) {
        shape.setFill('#036564');
        this.graphicsLayer.draw();
        this.buttons.getButton(shape.getAttrs()['row'], shape.getAttrs()['column']).set('enabled', false);
      }
      /* set to enabled */
      else {
        shape.setFill('#031634');
        this.graphicsLayer.draw();
        this.buttons.getButton(shape.getAttrs()['row'], shape.getAttrs()['column']).set('enabled', true);
      }
    }, 
    
    
    createButtonsToLayer: function (layer) {
      
      for (var i = 0; i < this.column; i++) {
        
        var circle = new Kinetic.Circle({
          x: 175 + i * 50, 
          y: 100, 
          radius: 6, 
          fill: '#CDB380'
        });
        
        layer.add(circle);
        this.indicators.at(i).set('graphic', circle);
      }
      
      for (var i = 0; i < this.row; i++) {
        
        for (var j = 0; j < this.column; j++) {
          
          var rect = new Kinetic.Rect({
            x: 155 + j * 50, 
            y: 120 + i * 50, 
            width: 40, 
            height: 40, 
            fill: '#036564', 
            cornerRadius: 10, 
            row: i, 
            column: j, 
            shadow: {
              color: 'black',
              blur: 5,
              offset: [2, 2],
              opacity: 0.5
            }
          });
          layer.add(rect);
          this.buttons.getButton(i, j).set('graphic', rect)
        }
      }
      
    }, 
    
    
    nextInterval: function () {
      
      var previousColumn = (this.currentColumn - 1 >= 0) ? this.currentColumn - 1 : this.column - 1;
      console.log("Current column: " + this.currentColumn);
      this.indicators.at(previousColumn).get('graphic').setFill('#CDB380');
      this.indicators.at(this.currentColumn).get('graphic').setFill('#033649');
      this.graphicsLayer.draw();
      
      
      for (var i = 0; i < this.row; i++) {
        
        if (this.buttons.getButton(i, this.currentColumn).get('enabled')) {
          
          soundManager.play(soundsArray[i], {multiShotEvents: true});
          
        }
      }
      
      this.currentColumn++;
      if (this.currentColumn >= this.column)  this.currentColumn = 0;
      
    }
    
  });
  
  var appView = new AppView ();
  
  
  
  
});
