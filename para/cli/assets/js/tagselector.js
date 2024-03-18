//-----------------------------------------------------------------------------
// TagSelector: Javascript for TagSelector control
// Created by Payton Bissell 1.20.2024
// Client Side JS
//-----------------------------------------------------------------------------
// Persistence is the responsibility of the consumer. 
//
// Items are not ordered (currently just appended at the front of the tag list), 
//  so we search through the whole thing for filters. 
//-----------------------------------------------------------------------------
var TagSelector = function(change_func)
{
  'use strict';

  var pv_DEBUG = true;
  var pv_change_func = change_func; 
  var pv_set_tags = [];
  var pv_unset_tags = []; // { h, t }
  var pv_prev_tag_filter = ""; // always all lower case. 

  //-----------------------------------------------------------------------------
  // Called by consumer to handle the user input for filtering candidate tags. 
  // Currently does case insensitive comparision from left, matching the characters
  // upto filter.length. Can't match internal strings. No RE or wildcards.
  //-----------------------------------------------------------------------------
  this.filter_changed = function(new_filt)
  { 
    if (pv_DEBUG==true) console.log("TS:Filter Changed: " + new_filt);

    // if filt is null or empty, then we clear all the hidden flags and end a filter.
    if ((new_filt==null) || (new_filt.length==0)) 
    { pv_prev_tag_filter="";
      for (var i=0;i<pv_unset_tags.length;i++) pv_unset_tags[i].h=0;
      pv_change_func("unset");
      return;
    }
  
    // either this is a continuation of a previous search, so we are further reducing candidates, or it
    // is a new filter, and we need to start fresh.  
    var l_filt_reset=true; // assume this is a new filter by default.
    var l_filt=new_filt.toLowerCase(); 
    if (l_filt.length>1) if (pv_prev_tag_filter === l_filt.substring(0, l_filt.length-1)) l_filt_reset=false;
    if (l_filt_reset==true) for (var i=0;i<pv_unset_tags.length;i++) pv_unset_tags[i].h=0;
    //console.log("FILTER-CHANGE: " + l_filt + " PREV: " + pv_prev_tag_filter + " RESET: " + l_filt_reset);
    
    // here, assume we are only filtering non-hidden candidates!
    for (var i=0;i<pv_unset_tags.length;i++) if (pv_unset_tags[i].h==0)
      if (new_filt !== pv_unset_tags[i].t.substring(0, new_filt.length).toLowerCase()) pv_unset_tags[i].h=1;
    
    pv_prev_tag_filter=new_filt;
    pv_change_func("unset"); 
  }
  
  //-----------------------------------------------------------------------------
  // The consumer sets the tags via this function.
  //-----------------------------------------------------------------------------
  this.initialize_tagsets = function(set_tags, unset_tags)
  { pv_set_tags=JSON.parse(JSON.stringify(set_tags));
    pv_unset_tags=[];
    for (var i=0;i<unset_tags.length;i++) pv_unset_tags.push( { "h":0, "t":unset_tags[i] });
    if (pv_DEBUG===true) console.log("Tags initialized: set.cnt=" + pv_set_tags.length + " unset.cnt=" + pv_unset_tags.length);
    pv_change_func("all");
  }
  
  //-----------------------------------------------------------------------------
  // When the user chooses a tag to be included for an entity, this function
  // updates the lists, and signals a refresh
  //-----------------------------------------------------------------------------
  this.select_tag = function(tag)
  { for (var pos=0;pos<pv_unset_tags.length;pos++) if (pv_unset_tags[pos].t===tag) 
    { pv_unset_tags.splice(pos,1);
      pv_set_tags.unshift(tag);
      pv_change_func("all");
      return;
    }  
    if (pv_DEBUG===true) console.log("Tag selection failed: " + tag);
  }    
  
  //-----------------------------------------------------------------------------
  // When the user chooses a tag to be removed from an entity, this function
  // updates the lists, and signals a refresh
  //-----------------------------------------------------------------------------
  this.deselect_tag = function(tag)
  { var pos = pv_set_tags.indexOf(tag);
    if (pos==-1) 
    { if (pv_DEBUG===true) console.log("Tag de-selection failed: " + tag);
      return;
    }
    pv_set_tags.splice(pos,1);
    pv_unset_tags.unshift( { "h":0, "t":tag});
    pv_change_func("all");
  }
  
  //-----------------------------------------------------------------------------
  // Allows the consumer to access the current tag lists (to support rendering). 
  //-----------------------------------------------------------------------------
  this.get_set_tags = function() { return pv_set_tags; }
  this.get_unset_tags = function() { return pv_unset_tags; }
}

//-----------------------------------------------------------------------------
// EOF
//-----------------------------------------------------------------------------
