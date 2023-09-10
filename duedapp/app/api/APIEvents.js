var events = {};

class APIEvents {
  static addListener(what, ident, func) {
    console.log('add listener :-> ', what, ' ,', ident, ' ,', func);
    console.log('add listener 1:-> ', what);
    console.log('add listener 2:-> ', ident);
    console.log('add listener 3:-> ', func);
    if (typeof events[what] == 'undefined') {
      events[what] = {};
    }
    events[what][ident] = func;
  }

  static removeListener(what, ident) {
    //console.log('rm listener',what,ident);
    if (typeof events[what] == 'undefined') {
      return;
    }
    if (typeof events[what][ident] != 'undefined') {
      delete events[what][ident];
    }
    var exists = false;
    for (var i in events[what]) {
      exists = true;
      break;
    }
    if (!exists) {
      delete events[what];
    }
  }

  static removeListenerAll(what) {
    if (typeof events[what] != 'undefined') {
      delete events[what];
    }
  }

  static call(what, payload) {
    if (typeof events[what] != 'undefined') {
      //for(var i in events[what]){
      //  console.log('will call',what,i);
      //   }

      for (var i in events[what]) {
        try {
          if (typeof events[what][i] != 'function') {
            continue;
          }
          events[what][i](payload);
        } catch (e) {
          console.log('discarded event call', e);
        }
      }
    }
  }
}

module.exports = APIEvents;
