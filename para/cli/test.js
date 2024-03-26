//-----------------------------------------------------------------------------
// Think/Paragraphs: Client Side: Testing Module  
// Created by Payton Bissell 3.24.24
// Property of Payton Bissell
// Client Side JS
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

var run_test = function()
{
  var p = new para();
  
  var cmd_pos=0;
  var run_flag=false;
  
  var i_para_list = null;
  var i_search_tags = [ 'tag1', 'tag2' ];
  var i_cur_pid = 5;
  var i_cur_para = null;
  var i_new_title = "";
  var i_cur_wid = 1;
  
  // populate storage with test data.
  p.dbg_reset();
  
  var run_cmd = function()
  { if (run_flag==false) return;
    run_flag=false;
  
    switch(cmd_pos)
    {
      case 1 : p.a_initialize(function(result)
      { console.log('INITIALIZE: ' + result);
        cmd_pos++; run_flag=true; // run next command!
      }); break;
  
      case 2 : p.a_login('plb', 'test', function(result, output)
      { console.log('LOGIN: ' + result + ' OUTPUT: ' + JSON.stringify(output));
        cmd_pos++; run_flag=true; // run next command!
      }); break;
  
      case 3 : p.a_paraSearch('filter-not-yet', i_search_tags, 100, function(result, output)
      { console.log('PARA_SEARCH: ' + result + ' OUTPUT: ' + JSON.stringify(output));
        i_para_list = JSON.parse(JSON.stringify(output));
        cmd_pos++; run_flag=true; // run next command!
      }); break;
  
      case 4 : p.a_paraGet(i_cur_pid, function(result, output)
      { console.log('PARA_GET: ' + result + ' OUTPUT: ' + JSON.stringify(output));
        i_cur_para = JSON.parse(JSON.stringify(output));
        cmd_pos++; run_flag=true; // run next command!
      }); break;
  
     /*
      case 5 : p.a_paraCreate(i_new_title, i_cur_wid, function(result, output)
      { console.log('PARA_CREATE: ' + result + ' OUTPUT: ' + output);
        i_cur_pid = JSON.parse(JSON.stringify(output));
        cmd_pos++; run_flag=true; // run next command!
      }); break;
     */
  
      case 5 : cmd_pos=1000; 
    }
    console.log('COMMAND COMPLETE.');
  }
  
  console.log('Running Tests...');
  cmd_pos=1;
  run_flag=true;
  while (cmd_pos<999) 
  { run_cmd(); 
  }
  console.log('Done Running Tests.')
}

run_test();

