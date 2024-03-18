//-----------------------------------------------------------------------------
// Think/Paragraphs: Client Side: Data Adapter
// Created by Payton Bissell 2.27.22
// Property of Payton Bissell
// Client Side JS
// Uses LocalStorage
//-----------------------------------------------------------------------------
// Test using test.html and test_main.js
//-----------------------------------------------------------------------------

//------------------------------------------------------------------------
// This module handles all the data for the paragraphs app...
//
// INTERFACE PROPOSAL:
//
// the a_ denotes an asynchronous call (promise)
//
// rf means function to be called when the function complets
//
//------------------------------------------------------------------------

var para = function()
{
  'use strict';

  //***********************************************************************
  // Public Functions
  //***********************************************************************
  
  //-----------------------------------------------------------------------
  // ASYNC Empty functions for simplified local testing, no user functions
  // in version 0.
  //------------------------------------------------------------------------
  this.a_login = function(usr, pwd, rf) { var deferred = $.Deferred(); rf(true, [ { "uid":1,"name":"test-user"}]); deferred.resolve(); return deferred.promise(); }
  this.a_logout = function(rf) { var deferred = $.Deferred(); rf(true); deferred.resolve(); return deferred.promise(); }

  //-----------------------------------------------------------------------
  // ASYNC Called whenever the App starts. Make sure the device is initialized
  //------------------------------------------------------------------------
  this.a_initialize = function(rf)
  { var deferred = $.Deferred();
    pv_auths = window.localStorage.getItem("Auths");
    pv_works = window.localStorage.setItem("Works");
    pv_paras = window.localStorage.setItem("Paragraphs");
    rf(true);
    deferred.resolve();
    return deferred.promise();
  }

  //-----------------------------------------------------------------------
  // ASYNC: For testing: ignore filter/tags/max and return all
  // -> [{pid, title}] :: a list of paragraphs matching search filter
  //-----------------------------------------------------------------------
  this.a_paraSearch = function(filt, tags, max, rf) 
  { var deferred = $.Deferred(); 
    rf(true, pv_paras_results); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: return a paragraph with pid
  //-> { pid, para_meta, text, notes, tags } :: get a specific paragraph
  //-----------------------------------------------------------------------
  this.a_paraGet = function(pid, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_para(pid);
    if (pos==-1) rf(false, {});
    else rf(true, pv_paras[pos]); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //-> pid :: create an empty paragraph return new pid
  //-----------------------------------------------------------------------
  this.a_paraCreate = function(title, wid, rf) 
  { var deferred = $.Deferred(); 
    var next_pid=0; 
    for (var i=0;i<pv_paras.length;i++) if (pv_paras[i].pid>next_pid) next_pid=pv_paras[i].pid; 
    pv_paras.push({ "pid": ++next_pid, "wid": wid, "title": title, "text": ""});
    window.localStorage.setItem("Paragraphs", pv_paras);
    rf(true, next_pid); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: Delete a paragraph
  //-----------------------------------------------------------------------
  this.a_paraDelete = function(pid, rf)
  { var deferred = $.Deferred(); 
    var pos=p_find_para(pid);
    if (pos==-1) rf(false);    
    else 
    { pv_paras.splice(pos, 1);    
      window.localStorage.setItem("Paragraphs", pv_paras);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: modify a paragraph (not text or note)
  //-----------------------------------------------------------------------
  this.a_paraUpdateMeta = function(pid, title, wid, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_para(pid);
    if (pos==-1) rf(false);    
    else
    { if (title!=null) pv_paras[pos].title=title;
      if ((wid!=null)&&(wid>=0)) pv_paras[pos].wid=wid;
      window.localStorage.setItem("Paragraphs", pv_paras);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: modify a paragraph's Text
  //-----------------------------------------------------------------------
  this.a_paraUpdateText = function(pid, txt, rf) 
  { var deferred = $.Deferred(); 
    if (txt==null) txt="";
    var pos=p_find_para(pid);
    if (pos==-1) rf(false);    
    else
    { pv_paras[pos].txt=txt;
      window.localStorage.setItem("Paragraphs", pv_paras);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: modify a paragraph's Notes
  //-----------------------------------------------------------------------
  this.a_paraUpdateNotes = function(pid, note, rf) 
  { var deferred = $.Deferred(); 
    if (note==null) txt="";
    var pos=p_find_para(pid);
    if (pos==-1) rf(false);    
    else
    { pv_paras[pos].note=note;
      window.localStorage.setItem("Paragraphs", pv_paras);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: add a tag to a pid, let the system know if typed or selected
  //-----------------------------------------------------------------------
  this.a_paraAddTag = function(pid, tag, new_tag, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_para(pid);
    if (pos==-1) rf(false); // pid not valid   
    else
    { var tpos=pv_paras[pos].tags.indexOf(tag);
      if (tpos!=-1) rf(false); // tag is present
      else
      { pv_paras[pos].tags.push(tag);
        window.localStorage.setItem("Paragraphs", pv_paras);
        rf(true); 
      }
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: remove a tag from a pid
  //-----------------------------------------------------------------------
  this.a_paraRemoveTag = function(pid, tag, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_para(pid);
    if (pos==-1) rf(false); // pid not valid   
    else
    { var tpos=pv_paras[pos].tags.indexOf(tag);
      if (tpos==-1) rf(false); // tag is NOT present
      else
      { pv_paras[pos].tags.splice(tpos, 1);
        window.localStorage.setItem("Paragraphs", pv_paras);
        rf(true); 
      }
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: give a paragraph a set of tags from another paragraph
  //-----------------------------------------------------------------------
  this.a_paraCopyTags = function(pid_dest, pid_src, rf) 
  { var deferred = $.Deferred(); 
    var pos_src=p_find_para(pid_src);
    var pos_dest=p_find_para(pid_dest);
    if ((pos_src==-1)||(pos_dest==-1)) rf(false); // one or both pids are not valid   
    else
    { pv_paras[pos_dest].concat(pv_paras[pos_src]);
      window.localStorage.setItem("Paragraphs", pv_paras);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //-> [{aid, name}] :: return a set of authors based on filt
  //-----------------------------------------------------------------------
  this.a_authSearch = function(filt, rf) 
  { var deferred = $.Deferred(); 
    rf(true, pv_auths); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //-> aid :: add an author to the system
  //-----------------------------------------------------------------------
  this.a_authCreate = function(name, rf) 
  { var deferred = $.Deferred(); 
    var next_aid=0; 
    for (var i=0;i<pv_auths.length;i++) if (pv_auths[i].aid>next_aid) next_aid=pv_auths[i].aid; 
    pv_auths.push({ "aid": ++next_aid, "name": name });
    window.localStorage.setItem("Auths", pv_auths);
    rf(true, next_aid); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: delete an author
  //-----------------------------------------------------------------------
  this.a_authDelete = function(aid, rf)
  { var deferred = $.Deferred(); 
    var pos=p_find_auth(aid);
    if (pos==-1) rf(false);    
    else 
    { pv_auths.splice(pos, 1);    
      window.localStorage.setItem("Auths", pv_auths);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: update the name of an author
  //-----------------------------------------------------------------------
  this.a_authUpdate = function(aid, name, rf)
  { var deferred = $.Deferred(); 
    var pos=p_find_auth(aid);
    if (pos==-1) rf(false);    
    else 
    { pv_auths[pos].name=name;    
      window.localStorage.setItem("Auths", pv_auths);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //-> [{wid, name, title}] :: return a set of works based on filt
  //-----------------------------------------------------------------------
  this.a_workSearch = function(filt, rf) 
  { var deferred = $.Deferred(); 
    rf(true, pv_works); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: 
  //-> aid :: add a work to the system
  //-----------------------------------------------------------------------
  this.a_workCreate = function(wid, aid, title, rf) 
  { var deferred = $.Deferred(); 
    var next_wid=0; 
    for (var i=0;i<pv_works.length;i++) if (pv_works[i].wid>next_wid) next_wid=pv_works[i].wid; 
    pv_works.push({ "wid": ++next_wid, "title": title, "aid": aid });
    window.localStorage.setItem("Works", pv_works);
    rf(true, next_wid); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: delete a work
  //-----------------------------------------------------------------------
  this.a_workDelete = function(wid, rf)
  { var deferred = $.Deferred(); 
    var pos=p_find_work(aid);
    if (pos==-1) rf(false);    
    else 
    { pv_works.splice(pos, 1);    
      window.localStorage.setItem("Works", pv_works);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: update the information for a work
  //-----------------------------------------------------------------------
  this.a_workUpdate = function(wid, aid, title, rf)
  { var deferred = $.Deferred(); 
    var pos=p_find_work(wid);
    if (pos==-1) rf(false);    
    else 
    { pv_works[pos].title=title;
      pv_works[pos].aid=aid;    
      window.localStorage.setItem("Works", pv_works);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: add a tag to a work
  //-----------------------------------------------------------------------
  this.a_workAddTag = function(wid, tag, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_tagset(tsid);
    if (pos==-1) rf(false); //tsid invalid
    else 
    { var i=pv_tagsets[pos].tags.indexOf(tag);
      if (i!=-1) rf(false); // tag already present
      pv_tagsets[pos].tags.push(tag);
      window.localStorage.setItem("Tagsets", pv_tagsets);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: remove a tag from a work
  //-----------------------------------------------------------------------
  this.a_workRemoveTag = function(wid, tag, rf) 
  { var deferred = $.Deferred(); 
    var pos=p_find_tagset(tsid);
    if (pos==-1) rf(false); //tsid invalid
    else 
    { var i=pv_tagsets[pos].tags.indexOf(tag);
      if (i==-1) rf(false); // tag not present
      pv_tagsets[pos].tags.splice(i,1);
      window.localStorage.setItem("Tagsets", pv_tagsets);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// IGNORE BELOW: these are just scraps, nothing is implemented...
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

  //***********************************************************************
  // INTERNAL TESTING 
  //***********************************************************************

  //-----------------------------------------------------------------------
  var i_test_paras = // pid, title, wid, txt, note, [tags]
  [ 
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
    { "pid":, "title": "wid": "txt": "note": "tags":[] }
  ];

  //-----------------------------------------------------------------------
  var i_test_auths = // aid, name
  [ 
    { "aid": "name": }
    { "aid": "name": }
    { "aid": "name": }
    { "aid": "name": }
  ];

  //-----------------------------------------------------------------------
  var i_test_works = // wid, aid, title
  [ 
    { "wid": "aid": "title": }
    { "wid": "aid": "title": }
    { "wid": "aid": "title": }
    { "wid": "aid": "title": }
  ];

  //-----------------------------------------------------------------------
  var i_test_tagsets = // tsid, name, [tags]
  [ 
    { "tsid": "name": "tags":[] }
  ];

  //-----------------------------------------------------------------------
  //:: clears storage and initializes to initial state
  //-----------------------------------------------------------------------
  var this.a_dbg_reset = function() 
  { var deferred = $.Deferred();
    window.localStorage.setItem("Paragraphs", i_test_paras);
    window.localStorage.setItem("Auths", i_test_auths);
    window.localStorage.setItem("Works", i_test_works);
    window.localStorage.setItem("Tagsets", i_test_tagsets);
    pv_auths = window.localStorage.getItem("Auths");
    pv_works = window.localStorage.setItem("Works");
    pv_paras = window.localStorage.setItem("Paragraphs");
    pv_tagsets = window.localStorage.setItem("Tagsets");
    rf(true);
    deferred.resolve();
    return deferred.promise();
  }

 var pv_DEBUG = true;

  var pv_auths = [];
  var pv_paras = [];
  var pv_tagsets = [];
  var pv_works = [];

  //***********************************************************************
  // Private Functions
  //***********************************************************************
 
  //------------------------------------------------------------------------
  var p_find_para = function(pid)
  { for (var i=0;i<pv_paras.length;i++) if (pv_paras[i].pid==pid) return i;
    return -1;
  }

  //------------------------------------------------------------------------
  var p_find_auth = function(aid)
  { for (var i=0;i<pv_auths.length;i++) if (pv_auths[i].aid==aid) return i;
    return -1;
  }

  //------------------------------------------------------------------------
  var p_find_work = function(wid)
  { for (var i=0;i<pv_works.length;i++) if (pv_works[i].wid==wid) return i;
    return -1;
  }

  //------------------------------------------------------------------------
  var p_find_tagset = function(tsid)
  { for (var i=0;i<pv_tagsets.length;i++) if (pv_tagsets[i].tsid==tsid) return i;
    return -1;
  }


//***********************************************************************
// EOF
//***********************************************************************
