function createObject (customValues) {
  return {
    position: {
      x: (customValues && customValues.position && customValues.position.x) || 0,
      y: (customValues && customValues.position && customValues.position.y) || 0
    },
    speed: {
      x: (customValues && customValues.speed && customValues.speed.x) || 0,
      y: (customValues && customValues.speed && customValues.speed.y) || 0
    },
    acceleration: {
      x: (customValues && customValues.acceleration && customValues.acceleration.x) || 0,
      y: (customValues && customValues.acceleration && customValues.acceleration.y) || 0
    },
    size: (customValues && customValues.size) || 0
  }
}

function updateObjects (objects) {
  for (var i=0; i<objects.length; i++) {
    var obj = objects[i];
    obj.position.x += obj.speed.x;
    if (obj.position.x <= -canvas.width/2) {
      obj.position.x = canvas.width/2;
    } else if (obj.position.x > canvas.width/2) {
      obj.position.x = -canvas.width/2;
    }
    obj.position.y += obj.speed.y;
    if (obj.position.y <= -canvas.height/2) {
      obj.position.y = canvas.height/2;
    } else if (obj.position.y > canvas.height/2) {
      obj.position.y = -canvas.height/2;
    }
  }
}
