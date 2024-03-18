//-----------------------------------------------------------------------------
// Main entry point: for testing TagSelector consumer
// Created by Payton Bissell 1.21.2024
// Client Side JS 
//-----------------------------------------------------------------------------

// id="p-plist-tags-set"  <button class="btn btn-primary tag" type="button">tag</button>
//            <div class="container tags-inp-cont" id="p-tag-filter-text">
//  id="p-plist-tags-unset"

function i_test()
{
  for (var i=0;i<20;i++) $("#p-plist-tags-set").append('<button class="btn btn-primary p-tag-set" type="button">tag</button>');
  for (var i=0;i<150;i++) $("#p-plist-tags-unset").append('<button class="btn btn-primary p-tag-unset" type="button">tag</button>');
}


function i_set_page_header(txt)
{ $("#page-header").text(txt); 
}

function i_hide_pages()
{ $("#page-plist").hide();
  $("#page-pedit").hide();
  $("#page-tedit").hide();
  $("#page-tag").hide();
  $("#page-auths").hide();
  i_set_page_header("");
}

function pgev_plist_goto()
{ i_hide_pages(); 
  i_set_page_header("Paragraph Search and Select...");
  $("#page-plist").show();
}

function pgev_pedit_goto(pid)
{ i_hide_pages(); 
  i_set_page_header("Edit Paragraph : pid=" + pid);
  $("#page-pedit").show();
}

function pgev_tedit_goto(pid, is_note)
{ i_hide_pages(); 
  i_set_page_header("Edit Text : pid=" + pid + " note=" + is_note);
  $("#page-tedit").show();
}

function pgev_tag_goto(mode, id)
{ i_hide_pages(); 
  i_set_page_header("Tag Editor : mode=" + mode + " id=" + id);
  $("#page-tag").show();
}

function pgev_auths_goto(pid)
{ i_hide_pages(); 
  i_set_page_header("Manage Authors and Works : pid=" + pid);
  $("#page-auths").show();
}

function para_startup()
{ //pgev_plist_goto(0);
  i_test(); 
}

// Force a save on exit by calling the timerHandler directly
//window.addEventListener('unload', function(event) 
//{ if ((editor_a!=null) && (i_editor_changed===true)) show_save_dialog(ed_save); 
//  else para_shutdown();
//});



//-----------------------------------------------------------------------------
// Bootstrap Studio startup code:
//-----------------------------------------------------------------------------

if (document.getElementsByClassName('clean-gallery').length > 0) 
{ baguetteBox.run('.clean-gallery', { animation: 'slideIn' });
}

if (document.getElementsByClassName('clean-product').length > 0) 
{ window.onload = function() { vanillaZoom.init('#product-preview'); };
}

//-----------------------------------------------------------------------------
// Paragraphs startup code:
//-----------------------------------------------------------------------------

para_startup();


//-----------------------------------------------------------------------------
// EOF
//-----------------------------------------------------------------------------
