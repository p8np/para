//-----------------------------------------------------------------------------
// Paragraphs Project: Server Side: Client Web Service Provider
// Returns JSON data to the client app
// Javascript via Node.js/Postgres Version 1.0
// Uses para.sql Schema
//-----------------------------------------------------------------------------
// See Developer Notes for Protocols
//-----------------------------------------------------------------------------

'use strict';

//-----------------------------------------------------------------------------
var pv_SVC_DEBUG = false;
var pv_LOG_ERRORS = false;

var SVC_VER = "0";
//var SECRET = "r6yztHZsHjhgwyDYJQf8Nbe3aIfpCKAa"; // for production (url is encoded via https)
var SECRET = "r6"; // for production (url is encoded via https)

// parameters to make sure making a random key is unique.
var DESIRED_CODE_LENGTH = 8;   // the length of user and device codes
var MAX_CODE_ATTEMPTS = 150;   // the max number of times we will try to find a random code
var INCREASE_SIZE_AT = 5;      // if we only have this many attempts left, then increase the size by one

//-----------------------------------------------------------------------------
var utils = require('./utils');
var n_util = require('util');

//-----------------------------------------------------------------------------
//
//
//-----------------------------------------------------------------------------
module.exports.start = function(db, cb)
{ console.log("STARTING PARA LIBRARY");
  return cb();
}

//-----------------------------------------------------------------------------
//
//
//-----------------------------------------------------------------------------
module.exports.end = function(db, cb)
{ console.log("EXITING PARA LIBRARY");
  return cb();
}

//-----------------------------------------------------------------------------
// all commands for the app come through this interface. Routed to proper
// funciton. cb is called with JSON to return to the caller.
//-----------------------------------------------------------------------------
module.exports.processRequest = function(db, query, body, cb) //f(output)
{
  // setup the input data package for the processing functions. Clean dangerous
  // SQL variables? Maybe in the end function to be more selective?
  var inp = {};
  if (body==="") inp = query;
  else inp = body;
  inp.sver = SVC_VER;

  if (inp.hasOwnProperty('flags')===true)  inp.flags  = utils.cleanSQLInput(inp.flags );
  if (inp.hasOwnProperty('tags')===true)   inp.tags   = utils.cleanSQLInput(inp.tags  );
  if (inp.hasOwnProperty('str')===true)    inp.str    = utils.cleanSQLInput(inp.str   );
  if (inp.hasOwnProperty('pid')===true)    inp.pid    = utils.cleanSQLInput(inp.pid   );
  if (inp.hasOwnProperty('title')===true)  inp.title  = utils.cleanSQLInput(inp.title );
  if (inp.hasOwnProperty('para')===true)   inp.para   = utils.cleanSQLInput(inp.para  );
  if (inp.hasOwnProperty('wid')===true)    inp.wid    = utils.cleanSQLInput(inp.wid   );
  if (inp.hasOwnProperty('loc')===true)    inp.loc    = utils.cleanSQLInput(inp.loc   );
  if (inp.hasOwnProperty('kind')===true)   inp.kind   = utils.cleanSQLInput(inp.kind  );
  if (inp.hasOwnProperty('parent')===true) inp.parent = utils.cleanSQLInput(inp.parent);
  if (inp.hasOwnProperty('stat')===true)   inp.stat   = utils.cleanSQLInput(inp.stat  );
  if (inp.hasOwnProperty('name')===true)   inp.name   = utils.cleanSQLInput(inp.name  );
  if (inp.hasOwnProperty('value')===true)  inp.value  = utils.cleanSQLInput(inp.value );
  if (inp.hasOwnProperty('tag')===true)    inp.tag    = utils.cleanSQLInput(inp.tag   );
  if (inp.hasOwnProperty('tgt')===true)    inp.tgt    = utils.cleanSQLInput(inp.tgt   );
  if (inp.hasOwnProperty('lid')===true)    inp.lid    = utils.cleanSQLInput(inp.lid   );
  if (inp.hasOwnProperty('cid')===true)    inp.cid    = utils.cleanSQLInput(inp.cid   );
  if (inp.hasOwnProperty('pidf')===true)   inp.pidf   = utils.cleanSQLInput(inp.pidf  );
  if (inp.hasOwnProperty('pidn')===true)   inp.pidn   = utils.cleanSQLInput(inp.pidn  );
  if (inp.hasOwnProperty('gid')===true)    inp.gid    = utils.cleanSQLInput(inp.gid   );
  if (inp.hasOwnProperty('attrs')===true)  inp.attrs  = utils.cleanSQLInput(inp.attrs );
  if (inp.hasOwnProperty('grps')===true)   inp.grps   = utils.cleanSQLInput(inp.grps  );
  if (inp.hasOwnProperty('bid')===true)    inp.bid    = utils.cleanSQLInput(inp.bid   );
  if (inp.hasOwnProperty('uid')===true)    inp.uid    = utils.cleanSQLInput(inp.uid   );
  if (inp.hasOwnProperty('token')===true)  inp.token  = utils.cleanSQLInput(inp.token );
  if (inp.hasOwnProperty('usr')===true)    inp.token  = utils.cleanSQLInput(inp.usr   );
  if (inp.hasOwnProperty('pwd')===true)    inp.pwd    = utils.cleanSQLInput(inp.pwd   );
  if (inp.hasOwnProperty('sess')===true)   inp.sess   = utils.cleanSQLInput(inp.sess  );
//  if (inp.hasOwnProperty('')===true)  inp.  = utils.cleanSQLInput(inp. );

console.log(inp);

  if (pv_SVC_DEBUG===true) console.log("SVC: " + JSON.stringify(inp));

  if (inp.cmd==='') return cb(makeErrorReply('Command missing'));

  //>>>>>>>>>>>>>>>>>>>>>>>> Login/Connect/Start Session <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  if (inp.cmd==="C00")
  { // no validation for now. Return user id, and secret
    return cb('{ status:"ok", uid:1, sess:"01234567890" }');
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> Verify Session <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  // for now session is hard coded
  if (inp.sess !== "01234567890") return cb(makeErrorReply('Unauthorized'));


  //>>>>>>>>>>>>>>>>>>>>>>>> Get list of paragraphs <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C01") // PSearch(flags, tags, str)
  { return cb('{ status: "not implemented" }');
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> Retrieve a paragraph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C02") // PGet(pid)
  { var output = { status:"ok" };
    db.query("select wid, title, tags, loc, attrs, ver from paras where pid=" + imp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      output["para"] = res.rows[0];
      return cb( JSON.stringify(output) );
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> Create a new paragraph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C03") // PCreate(title, <para>, wid, loc, parent, kind, stat)
  { var sql = "";
    if (inp.hasOwnProperty('para')===true)
      sql="insert into paras (title, para, wid, loc, parent, kind, stat) values ('"
      + inp.title + "','" + inp.para + "','" + inp.wid + "','" + inp.loc + "','" + inp.parent + "','"
      + inp.kind + "','" + inp.stat + "') returning pid;";
    else
      sql="insert into paras (title, wid, loc, parent, kind, stat) values ('"
      + inp.title + "','" + inp.wid + "','" + inp.loc + "','" + inp.parent + "','"
      + inp.kind + "','" + inp.stat + "') returning pid;";
    db.query(sql, function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      return cb('{ status:"ok", pid: "' + res.rows[0].pid + '" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C04") // PUpdate(pid, name, value)
  { db.query("update paras set " + inp.name + " = '" + inp.value + "' where pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C05") // PDelete(pid)
  { db.query("delete from paras where pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C06") // PTag(pid, tag, flags)
  { var sql="";
    if (inp.flag==='1') sql="update paras set tags = replace(tags, '" + inp.tag + "', '') where pid=" + inp.pid + ";"
    else sql="update paras set tags = tags || ' ' || '" + inp.tag + "' where pid=" + inp.pid + ";"
    db.query(sql, function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  //regexp_replace(string text, pattern text, replacement text [, flags text])
  else if (inp.cmd==="C07") // PAttr(pid, attr, flags)
  { if (inp.flag==='1')
    { var expr = '"' + inp.attr + '":".*"';
      sql="update paras set attrs = regexp_replace(attrs, " + expr + ", '') where pid=" + inp.pid + ";"
    }
    else sql="update paras set attrs = attrs || ' ' || '" + inp.attr + "' + where pid=" + inp.pid + ";"
    db.query(sql, function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C08") // PGetText(pid)
  { db.query("select para from paras where pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      return cb('{ status:"ok", pid=' + inp.pid + 'para: "' + res.rows[0].para + '" }');
    });

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C09") // PSetText(pid, para)
  { db.query("update paras set paras = '" + inp.para + "' where pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }
  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C10") // PSuggestTags(pid)
  { return cb('{ status: "not implemented" }');
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C11") // PGetLinks(pid)
  { var output = { status:"ok", from:[], to:[] };
    // select links that I point to, and that point to me
    db.query("select pid, tgt, lid, title, cid from links where pid=" + imp.pid + " or tgt=" + imp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      //if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      for (var i=0;i<res.rows.length;i++)
       { if (res.rows[i].pid===pid) output.to.push( { pid: res.rows[i].tgt, lid: res.rows[i].lid, title: res.rows[i].title, cid: res.rows[i].cid } );
         else output.from.push( { pid: res.rows[i].pid, lid: res.rows[i].lid, title: res.rows[i].title, cid: res.rows[i].cid } );
       }
       return cb( JSON.stringify(output) );
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C12") // PGetGroups(pid)
  { var output = { status:"ok", groups:[] };
    db.query("select m.gid as gg, g.title as tt from grps as g, grp_paras as m where g.pid=m.pid and m.pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      for (var i=0;i<res.rows.length;i++) output.groups.push( { gid: res.rows[i].gg, title: res.rows[i].tt } );
      return cb( JSON.stringify(output) );
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C13") // PGetChains(pid)
  { var output = { status:"ok", chains:[] };
    db.query("select c.cid as cc, c.title as ct from chains as c, chn_nodes as n where c.cid=n.cid and n.pid=" + inp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      for (var i=0;i<res.rows.length;i++) output.chains.push( { cid: res.rows[i].cc, title: res.rows[i].ct } );
      return cb( JSON.stringify(output) );
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C20") // LCreate(pid, tgt, title)
  { var sql="insert into links (pid, tgt, title) values ('"
      + inp.pid + "','" + inp.tgt + "','" + inp.title + "') returning lid;";
    db.query(sql, function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      return cb('{ status:"ok", lid: "' + res.rows[0].lid + '" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C21") // LUpdate(lid, title)
  { db.query("update links set title='" + inp.title + "' where lid=" + imp.lid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C22") // LDelete(lid)
  { db.query("delete from links where lid=" + imp.lid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C30") // CCreate(title)
  { var sql="insert into chains (title) values ('" + inp.title + "') returning cid;";
    db.query(sql, function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      return cb('{ status:"ok", cid: "' + res.rows[0].cid + '" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C31") // CSearch
  { var output = { status:"ok", chains:[] };
    db.query("select cid, title from chains", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      for (var i=0;i<res.rows.length;i++) output.chains.push( { cid: res.rows[i].cid, title: res.rows[i].title } );
      return cb( JSON.stringify(output));
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C32") // CDelete(cid)
  { db.query("delete from chains where cid=" + imp.cid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C33") // CNodeInsert(cid, prev_pid, pid)
  { db.query("call chn_insert(" + inp.cid + "," + inp.prev_pid + "," + inp.pid + ");", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C34") // CNodeDelete(cid, pid)
  { db.query("call chn_delete_node(" + inp.nid + ");", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C35") // CUpdate(cid, title)
  { db.query("update chains set title='" + inp.title + "' where cid=" + inp.cid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C36") // CGetPids(cid)
  { var output = { status:"ok", pids:[] };
    db.query("select chn_get_pids(" + inp.cid + ");", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      for (var i=0;i<res.rows.length;i++) output.pids.push( res.rows[i].pid );
      return cb( JSON.stringify(output));
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C40") // GCreate(title)
  { db.query("insert into grouds (title) values ('" + inp.title + "') returning gid;", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      if (res.rows.length<=0) return cb(makeErrorReply('DB Error 0101 - '));
      return cb('{ status:"ok", gid: "' + res.rows[0].gid + '" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C41") // GAdd(gid, pid)
  { db.query("insert into grp_paras (gid, pid) values (" + inp.gid + ", " + imp.pid + ");", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C42") // GRemove(gid, pid)
  { db.query("delete from grp_paras where gid=" + inp.gid + " and pid=" + imp.pid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C43") // GGet(gid)
  { var output = { status:"ok", pids:[] };
    db.query("select p.pid, p.title from from paras, grp_paras where gid=" + inp.gid + ");", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      for (var i=0;i<res.rows.length;i++) output.pids.push( res.rows[i].pid );
      return cb( JSON.stringify(output));
    });
  }

  C43 GGet(gid)
    - Return a list of pids belonging to a group
    { 0/Error, [ { pid, title } ] }


{ db.query("delete from links where lid=" + imp.lid + ";", function(err, res)
    { if (err) return cb(makeErrorReply('DB Error 0101 - ' + err));
      return cb('{ status:"ok" }');
    });



C50 BCreate(title, wid, attrs, tags, grps)
  - Create a bucket
  { 0/Error, bid }

  C51 BDelete(bid)
  - Remove a bucket from the system
  { 0/Error }

  C52 BUpdate(bid, wid, attrs, tags, grps)
  - Modify a bucket
  { 0/Error }

  C53 BApply(bid, pid)
  { 0/Error }


  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C50") // BCreate(title, wid, attrs, tags, grps)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C51") // BDelete(bid)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C52") // BUpdate(bid, wid, attrs, tags, grps)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C53") // BApply(bid, pid)
  {
  }

  C90 UCreate
  - Create a user
  { 0/Error, uid }

  C91 URemove(uid)
  - Remove a user
  { 0/Error }

  C92 UAuth(usr, pwd)
  { 0/Error, uid, token }


  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C90") // UCreate
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C91") // URemove(uid)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="C92") // UAuth(usr, pwd)
  {
  }

  CA0 SGet(uid, name)
  { 0/Error, val }

  CA1 SSet(uid, name, val)
  { 0/Error }

  CA2 SGetAll(uid)
  { 0/Error, [ { name, val }* ] }


  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="CA0") // SGet(uid, name)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="CA1") // SSet(uid, name, val)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  else if (inp.cmd==="CA2") // SGetAll(uid)
  {
  }

  //>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  //else if (inp.cmd==="C") //
  //{
  //}

  else
  { return cb(makeErrorReply('COMMAND UNKNOWN'));
  }

}

//-----------------------------------------------------------------------------
var format_output_object_to_text = function(obj, name, status)
{ var op = n_util.inspect(obj);
console.log("OP: " + op);
  return '{ status: "' + status + '", ' + name + ': ' + op + ' }';
}

//-----------------------------------------------------------------------------
var makeErrorReply = function(msg)
{ console.log('{ "Status": "Error", "Msg": "' + msg + '" }');
  return '{ "Status": "Error", "Msg": "' + msg + '" }';
}

//-----------------------------------------------------------------------------
// Generating a random code for devices or users. Since this is random it is
// prone to collisions. So repeat the function as requested. This is not
// ideal, but it allows for short codes without any patterns for guessing codes.
//-----------------------------------------------------------------------------
var generateCode = function(db, cnt, inc_cnt, len, table, field, cb)
{ if (cnt===inc_cnt) len=len+1; // only increment len once per top level cinp.
  if (cnt===0) return cb("ERROR");
  var code = utils.getRandomConfString(len);
  db.query("select count(*) as cnt from " + table + " where " + field + "='" + code + "';", function(err, result)
  { if (err) return cb("ERROR"); //throw err;
    if (result.rows[0].cnt!=="0") return generateCode(db, cnt-1, inc_cnt, len, table, field, cb);
    db.query("insert into " + table + " (" + field + ", dttm) values ('" + code + "', now() at time zone 'utc');", function(err, result) { if (err) console.log("QE: " + JSON.stringify(err)); });
    return cb(code);
  });
}

// EOF
