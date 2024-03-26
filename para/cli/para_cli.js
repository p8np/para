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
  // Privates
  //***********************************************************************

  var pv_auths = [];
  var pv_paras = [];
  var pv_works = [];
  var pv_tags = [];
 
  //------------------------------------------------------------------------
  var p_find_tag = function(tag)
  { for (var i=0;i<pv_tags.length;i++) 
      if (pv_tags[i].tag.localCompare(tag)==0) return i;
    return -1;
  }

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
    pv_auths = JSON.parse(window.localStorage.getItem("Auths"));
    pv_works = JSON.parse(window.localStorage.getItem("Works"));
    pv_paras = JSON.parse(window.localStorage.getItem("Paragraphs"));
    pv_tags  = JSON.parse(window.localStorage.getItem("Tags"));
    if (pv_auths==null) pv_auths=i_auths;
    if (pv_works==null) pv_works=i_works;
    if (pv_paras==null) pv_paras=i_paras;
    if (pv_tags==null) pv_tags=i_tags;
    rf(true);
    deferred.resolve();
    return deferred.promise();
  }

  //-----------------------------------------------------------------------
  // ASYNC: For testing: ignore filter/tags/max and return all
  // -> [{pid, title}] :: a list of paragraphs matching search filter
  // FOR NOW just return all pids
  //-----------------------------------------------------------------------
  this.a_paraSearch = function(filt, tags, max, rf) 
  { var deferred = $.Deferred(); 
    var tmp = [];
    for (var i=0;i<pv_paras.length;i++) tmp.push({ "pid": pv_paras[i].pid, "title": pv_paras[i].title });
    rf(true, tmp); 
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  // ASYNC: return a paragraph with pid
  //-> { pid, wid, title, wloc, text, notes, tags } :: get a specific paragraph
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
  this.a_paraUpdateMeta = function(pid, title, wid, wloc, rf) 
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
  this.a_paraUpdateText = function(pid, text, rf) 
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
        var tp = p_find_tag(tag);
        if (tp==-1) 
        { pv_tags.push(tag);
          window.localStorage.setItem("Tags", pv_tags);
        }
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
  //-> [{wid, title, aid}] :: return a set of works based on filt
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
    { if (title) pv_works[pos].title=title;
      if (aid) pv_works[pos].aid=aid;    
      if ((aid)||(title)) window.localStorage.setItem("Works", pv_works);
      rf(true); 
    }
    deferred.resolve(); 
    return deferred.promise(); 
  }

  //-----------------------------------------------------------------------
  //-----------------------------------------------------------------------
  //-----------------------------------------------------------------------

  var i_para_test_data = null; 

  //-----------------------------------------------------------------------
  //:: clears storage and initializes to initial state
  //-----------------------------------------------------------------------
  this.dbg_reset = function() 
  { window.localStorage.setItem("Paragraphs", JSON.stringify(i_para_test_data.paras));
    window.localStorage.setItem("Auths",   JSON.stringify(i_para_test_data.authors));
    window.localStorage.setItem("Works",   JSON.stringify(i_para_test_data.works));
    window.localStorage.setItem("Tags", JSON.stringify(i_para_test_data.tags));
  }

/*
  //-----------------------------------------------------------------------
  // ASYNC: 
  //:: give a paragraph a set of tags from another paragraph
  // SHOULD PREVENT DUPLICATES
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
*/

i_para_test_data = 
{ 

"works": 
[
 { "wid": 1,  "aid":1,  "title":"Dark Night of the Soul (Dover Thrift Editions: Religion)" },
 { "wid": 2,  "aid":2,  "title":"Literature and the Gods (Vintage International)" },
 { "wid": 3,  "aid":3,  "title":"Late Sophocles: The Hero’s Evolution in Electra, Philoctetes, and Oedipus at Colonus" },
 { "wid": 4,  "aid":4,  "title":"Modern Man in Search of a Soul" },
 { "wid": 5,  "aid":5,  "title":"Short Stories by Jesus: The Enigmatic Parables of a Controversial Rabbi" },
 { "wid": 6,  "aid":6,  "title":"Oxygen: The molecule that made the world" },
 { "wid": 7,  "aid":7,  "title":"Mysticism: A Study in Nature and Development of Spiritual Consciousness" },
 { "wid": 8,  "aid":8,  "title":"A History of Religious Ideas Volume 1: From the Stone Age to the Eleusinian Mysteries" },
 { "wid": 9,  "aid":9,  "title":"Classic Short Stories: The Complete Collection: All 100 Masterpieces" },
 { "wid": 10, "aid":10, "title":"How (Not) to Be Secular: Reading Charles Taylor" },
 { "wid": 11, "aid":11, "title":"Deep is the Hunger: Meditations for Apostles of Sensitiveness" },
 { "wid": 12, "aid":12, "title":"On Stories: And Other Essays on Literature" }
], 

"authors":
[
  { "aid": 1,  "name": "St. John of the Cross" },
  { "aid": 2,  "name": "Roberto Calasso" },
  { "aid": 3,  "name": "Thomas Van Nortwick" },
  { "aid": 4,  "name": "Carl Gustav Jung" },
  { "aid": 5,  "name": "Amy-Jill Levine" },
  { "aid": 6,  "name": "Nick Lane" },
  { "aid": 7,  "name": "Evelyn Underhill" },
  { "aid": 8,  "name": "Mircea Eliade" },
  { "aid": 9,  "name": "Elsinore Books" },
  { "aid": 10, "name": "James K. A. Smith" },
  { "aid": 11, "name": "Howard Thurman" },
  { "aid": 12, "name": "C. S. Lewis" }
],

"tags":
[ 
  "Jung", "Science", "Sad", "Cat", "Dog"
],

"paras": 
[ 
  { "pid":1,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":1,  "text":"However greatly the soul itself labours, it cannot actively purify itself so as to be in the least degree prepared for the Divine union of perfection of love, if God takes not its hand and purges it not in that dark fire."},
  { "pid":2,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":1,  "text":"the soul, after it has been definitely converted to the service of God, is, as a rule, spiritually nurtured and caressed by God." },
  { "pid":3,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":2,  "text":"But whether a poem chooses to name Apollo, or maybe an oak tree, or the ocean’s foam, doesn’t make much difference and can hardly be very meaningful: they are all terms from the literary lexicon, worn smooth by use. Yet there was a time when the gods were not just a literary cliché, but an event, a sudden apparition, an encounter with bandits perhaps, or the sighting of a ship." },
  { "pid":4,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":3,  "text":"Should inherited excellence continue to provide the basis for the distribution of social and political leverage, or—as the Sophists and their adherents claimed—could anyone learn to be excellent and thus be a fitting holder of power?" },
  { "pid":5,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":3,  "text":"the Sophoclean tragic hero—lonely, defiant, and self-destructive—" },
  { "pid":6,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":3,  "text":"the son of a minor goddess and therefore semidivine. Such a figure is useful to artists, because he or she can draw our imagination across those crucial boundaries and invite us to think about them, which in turn prompts reflection on the precise nature of human experience and the meaning of a human life." },
  { "pid":7,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":3,  "text":"The traits we see in Homer’s hero make him destructive, of himself and of those around him. Perhaps the adjective that defines Achilles most accurately is deinos, “inspiring awe, fear, astonishment.” He is deinos, to be treated with great care." },
  { "pid":8,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"it is highly important for the analyst to admit his lack of understanding from time to time, for nothing is more unbearable for the patient than to be always understood." },
  { "pid":9,   "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"We appeal only to the patient's brain if we try to inculcate a truth; but if we help him to grow up to this truth in the course of his own development, we have reached his heart, and this appeal goes deeper and acts with greater force." },
  { "pid":10,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"achieving any therapeutic results depend chiefly upon suggestion." },
  { "pid":11,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"the procedure of bringing to light the parts of the personality which were previously unconscious and subjecting them to conscious discrimination and criticism." },
  { "pid":12,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"We must never forget in dream-analysis, even for a moment, that we move on treacherous ground where nothing is certain but uncertainty." },
  { "pid":13,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"Are we still unable to see that man's conscious mind is even more devilish and perverse than the unconscious?" },
  { "pid":14,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":4,  "text":"It is always helpful, when we set out to interpret a dream, to ask: What conscious attitude does it compensate?" },
  { "pid":15,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"Reducing parables to a single meaning destroys their aesthetic as well as ethical potential. This surplus of meaning is how poetry and storytelling work," },
  { "pid":16,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"When we seek universal morals from a genre that is designed to surprise, challenge, shake up, or indict and look for a single meaning in a form that opens to multiple interpretations, we are necessarily limiting the parables and, so, ourselves." },
  { "pid":17,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"A parable requires no external key to explain what its elements mean; an allegory does." },
  { "pid":18,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"What is infectiously appealing about Jesus is that he likes to celebrate. He is consistently meeting people not at the altar but at table, whether as host, guest, or the body and blood to be consumed (as in John 6 and the synoptic Last Supper accounts). He is indiscriminate in his dining companions, who include Pharisees, tax collectors, sinners, and even an upscale family consisting of two sisters and a formerly dead brother." },
  { "pid":19,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"To be in his presence is not only to be challenged and comforted; it is to celebrate at table." },
  { "pid":20,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"Absence of evidence—his reaction, his views—is not the same thing as evidence of absence." },
  { "pid":21,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"“When Israelites are reduced to eating carob pods, they repent.”" },
  { "pid":22,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"“In a way, he is behaving like a mother—kissing, dressing, feeding.” The next step is of course to claim, “This father abandons male honor for female shame.”" },
  { "pid":23,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"the father indulges the one who slights him and slights the one who indulges him." },
  { "pid":24,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"He first needs to express his own resentment." },
  { "pid":25,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":5,  "text":"“It is the dutiful, religiously obedient, yet joyless, older brother who tends to serve as the emblem of sin.”" },
  { "pid":26,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":6,  "text":"Scientists are people, and bring their own expertise, experience and biases to research problems. This is a far cry from how philosophers tell us that science ‘should’ work, but the idea of the scientific method as an inductive procedure in which facts emerge from accumulating data is as misguided as can be. In reality, experiments are conceived and interpreted in terms of particular hypotheses, so data are generated on particular aspects of a problem rather than the whole problem." },
  { "pid":27,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":6,  "text":"In effect, the diseases of old age are the price we pay for the way in which we are set up to handle infections and other forms of stress in our youth. In both cases, the shadowy agent pulling the strings is oxidative stress. The outcomes are diametrically opposed: resistance to disease in youth and vulnerability to disease in old age. The duplicitous role of oxidative stress is central to both, in what I shall call the ‘doubleagent’ theory of ageing and disease" },
  { "pid":28,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"the hidden Truth which is the object of man's craving; the only satisfying goal of his quest." },
  { "pid":29,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"for the mystics are the pioneers of the spiritual world, and we have no right to deny validity" },
  { "pid":30,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"reality consists in impressions and ideas." },
  { "pid":31,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"It is immediately apparent, however, that this sense-world, this seemingly real external universe--though it may be useful and valid in other respects--cannot be the external world, but only the Self's projected picture of it. [3] It is a work of art, not a scientific fact; and, whilst it may well possess the profound significance proper to great works of art, is dangerous if treated as a subject of analysis." },
  { "pid":32,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"to know oneself is really to know one's universe." },
  { "pid":33,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Eckhart's words are still final for us: the soul can only approach created things by the voluntary reception of images." },
  { "pid":34,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"They are tormented by the Unknowable, ache for first principles, demand some background to the shadow show of things. In so far as man possesses this temperament, he hungers for reality, and must satisfy that hunger as best he can: staving off starvation, though he many not be filled." },
  { "pid":35,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Naturalism, or naive Realism: the point of view of the plain man. Naturalism states simply that we see the real world, though we may not see it very well. What seems to normal healthy people to be there, is approximately there. It congratulates itself on resting in the concrete; it accepts material things as real. In other words, our corrected and correlated sense impressions, raised to their highest point of efficiency, form for it the only valid material of knowledge: knowledge itself being the classified results of exact observation.    Such an attitude as this may be a counsel of prudence, in view of our ignorance of all that lies beyond: but it can never satisfy our hunger for reality. It says in effect, The room in which we find ourselves is fairly comfortable. Draw the curtains, for the night is dark: and let us devote ourselves to describing the furniture. Unfortunately, however, even the furniture refuses to accommodate itself to the naturalistic view of things." },
  { "pid":36,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"It is no more solid than a snowstorm." },
  { "pid":37,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"for practical purposes we have agreed that sanity consists in sharing the hallucinations of our neighbours. Those who are honest with themselves know that this sharing is at best incomplete." },
  { "pid":38,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Eyes and ears, said Heracleitus, are bad witnesses to those who have barbarian souls: and even those whose souls are civilized tend to see and hear all things through a temperament." },
  { "pid":39,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"artist and surgeon, Christian and rationalist, pessimist and optimist, do actually and truly live in different and mutually exclusive worlds, not only of thought but also of perception. Only the happy circumstance that our ordinary speech is conventional, not realistic, permits us to conceal from one another the unique and lonely world in which each lives." },
  { "pid":40,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Each of us, as we grow and change, works incessantly and involuntarily at the re-making of our sensual universe. We behold at any specific moment not that which is, but that which we are," },
  { "pid":41,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Scientific Realist calls knowledge, are at best relative and conventionalized symbols of that aspect of the unknowable reality at which they hint." },
  { "pid":42,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"In the great moments of existence, when he rises to spiritual freedom, these are the things which every man feels to be real. It is by these and for these that he is found willing to live, work suffer, and die. Love, patriotism, religion, altruism, fame, all belong to the transcendental world. Hence, they partake more of the nature of reality than any fact could do;" },
  { "pid":43,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Religions as a rule are steeped in idealism:" },
  { "pid":44,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Over and over again, their Scriptures tell us that only materialists will be damned." },
  { "pid":45,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"But, when we ask the idealist how we are to attain communion with the reality which he describes to us as certainly there, his system suddenly breaks down; and discloses itself as a diagram of the heavens, not a ladder to the stars." },
  { "pid":46,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Idealism, though just in its premises, and often daring and honest in their application, is stultified by the exclusive intellectualism of its own methods: by its fatal trust in the squirrel-work of the industrious brain instead of the piercing vision of the desirous heart." },
  { "pid":47,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"Hence the thing that matters, the living thing, has somehow escaped it; and its observations bear the same relation to reality as the art of the anatomist does to the mystery of birth." },
  { "pid":48,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"The horrors of nihilism, in fact, can only be escaped by the exercise of faith," },
  { "pid":49,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"The intellectual quest of Reality, then, leads us down one of three blind alleys: (1) To an acceptance of the symbolic world of appearance as the real; (2) to the elaboration of a theory also of necessity symbolic--which, beautiful in itself, cannot help us to attain the Absolute which it describes; (3) to a hopeless but strictly logical skepticism." },
  { "pid":50,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":7,  "text":"When we are in good health, we all feel very real, solid, and permanent; and this is of all our illusions the most ridiculous, and also the most obviously useful from the point of view of the efficiency and preservation of the race." },
  { "pid":51,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":8,  "text":"the mystical solidarity between the hunter and his victims is revealed by the mere act of killing: the shed blood is similar in every respect to human blood. In the last analysis, this “mystical solidarity” with the game reveals the kinship between human societies and the animal world. To kill the hunted beast or, later, the domestic animal is equivalent to a “sacrifice” in which the victims are interchangeable." },
  { "pid":52,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":8,  "text":"Every document, even of our own time, is spiritually opaque as long as it has not been successfully deciphered by being integrated into a system of meanings." },
  { "pid":53,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":9,  "text":"supposing that away yonder at the end of the world there stood great stone walls and the fierce winds were chained up to the walls... if they had not broken loose, why did they tear about all over the sea like maniacs, and struggle to escape like dogs? If they were not chained up, what did become of them when it was calm?" },
  { "pid":54,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":9,  "text":"Life is not given twice, it must be treated mercifully.”" },
  { "pid":55,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":9,  "text":"I see irresponsible tyranny—I protest. I see cant and hypocrisy—I protest. I see swine triumphant—I protest." },
  { "pid":56,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":9,  "text":"Kill me and I will haunt them with my ghost. All my acquaintances say to me: ‘You are a most insufferable person, Pavel Ivanitch.’ I am proud of such a reputation. I have served three years in the far East, and I shall be remembered there for a hundred years: I had rows with everyone. My friends write to me from Russia, ‘Don’t come back,’ but here I am going back to spite them... yes... That is life as I understand it. That is what one can call life.”" },
  { "pid":57,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Your neighbors inhabit what Charles Taylor calls an “immanent frame”; they are no longer bothered by “the God question” as a question because they are devotees of “exclusive humanism” — a way of being-in-the-world that offers significance without transcendence. They don’t feel like anything is missing." },
  { "pid":58,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "to most humans, curiosity about higher things comes naturally, it’s indifference to them that must be learned.1" },
  { "pid":59,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "that religion might just be true simply because it is beautiful. “The Christian religion didn’t last so long merely because everyone believed it” (p. 53), Barnes observes. It lasted because it makes for a helluva novel — which is pretty close to Tolkien’s claim that the gospel is true because it is the most fantastic fantasy, the greatest fairy story ever told." },
  { "pid":60,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Without the madness of the gospel, Mozart would never have composed a requiem, Giotto would never have left us the treasures in the chapel of Padua." },
  { "pid":61,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Barnes remains a good disciple of Flaubert, of whom he comments: “While he distrusted religions, he had a tenderness towards the spiritual impulse, and was suspicious of militant atheism. ‘Each dogma in itself is repulsive to me,’" },
  { "pid":62,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "The doubter’s doubt is faith; his temptation is belief, and it is a temptation that has not been entirely quelled, even in a secular age." },
  { "pid":63,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "As Paul Elie aptly notes, twentieth-century fiction was where we saw that “the churchgoer was giving way to the moviegoer.”" },
  { "pid":64,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "I don’t think you should write something as long as a novel around anything that is not of the gravest concern to you and everybody else, and for me this is always the conflict between an attraction for the Holy and the disbelief in it that we breathe in with the air of our times. It’s hard to believe always but more so in the world we live in now. There are some of us who have to pay for our faith every step of the way and who have to work out dramatically what it would be like without it and if being without it would be ultimately possible or not.11" },
  { "pid":65,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "The clear lines of any orthodoxy are made crooked by our experience, are complicated by our lives." },
  { "pid":66,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Ardor and devotion cannot undo the shift in plausibility structures that characterizes our age." },
  { "pid":67,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Taylor: “the present age,” he surmised, “is better than Christendom. In the old Christendom, everyone was a Christian and hardly anyone thought twice about it. But in the present age the survivor of theory and consumption becomes a wayfarer in the desert, like St. Anthony; which is to say, open to signs.”14" },
  { "pid":68,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "While stark fundamentalisms — either religious or secular — get all the press, what should interest us are these fugitive expressions of doubt and longing, faith and questioning." },
  { "pid":69,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "where the escapes are boredom and distraction, not ecstasy and rapture.18 Hell is self-consciousness, and our late modern, TV-ized (now Twitter-ized) world only ramps up our self-awareness to an almost paralyzing degree. God is dead, but he’s replaced by everybody else." },
  { "pid":70,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Everything is permitted, but everybody is watching. So most of the time the best “salvation” we can hope for is found in behaviors that numb us to this reality: drugs, sex, entertainments of various sorts." },
  { "pid":71,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Wake up and smell the disenchantment." },
  { "pid":72,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "What passes for “atheism,” he observes, is still a mode of worship, “a kind of anti-religious religion, which worships reason, skepticism, intellect, empirical proof, human autonomy, and self-determination.”" },
  { "pid":73,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "“the fact that the most powerful and significant connections in our lives are (at the time) invisible to us seems to me a compelling argument for religious reverence rather than skeptical empiricism as a response to life’s meaning.”" },
  { "pid":74,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "that we can’t trust our impulses or memories or inclinations to reverence. And yet this religious ghost can’t be exorcised either.28" },
  { "pid":75,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Secularization theorists (and their opponents) are barking up the wrong tree precisely because they fixate on expressions of belief rather than conditions of belief. Similarly, secularists, who demand the decontamination of the public sphere as an areligious zone, tend to be a bit unreflective about the epistemic questions that attend their own beliefs.32" },
  { "pid":76,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the “subtraction stories” of secularization theory, those tales of enlightenment and progress and maturation that see the emergence of modernity and “the secular” as shucking the detritus of belief and superstition. Once upon a time, as these subtraction stories rehearse it, we believed in sprites and fairies and gods and demons. But as we became rational, and especially as we marshaled naturalist explanations for what we used to attribute to spirits and forces, the world became progressively disenchanted. Religion and belief withered with scientific exorcism of superstition. Natch.40 On Taylor’s account, the force of such subtraction stories is as much in their narrative power as in their ability to account for the “data,” so to speak. There is a dramatic tension here, a sense of plot, and a cast of characters with heroes (e.g., Galileo) and villains (e.g., Cardinal Bellarmine)." },
  { "pid":77,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "modern notion of literariness, as something simultaneously distinct from Christianity and yet remarkably proximate to it, emerges for the first time during the Romantic era.”" },
  { "pid":78,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "if we’re going to make sense of our muddled present, we need to get close to the ground and explore all kinds of contingent twists and turns that are operative in the background of our present. We need to attend to the background of what Jeffrey Stout calls our “dialectical location,”43 the concrete particulars that make us “us,” that got us to where we are.44" },
  { "pid":79,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "“it is, on the contrary, when I study myself, as I have been doing for the past two months, with a curiosity which is stronger than my disgust; it is when I feel myself most fully in possession of my faculties that the Christian temptation torments me. I can no longer deny that a route exists in me which might lead me to your God” (p. 104)." },
  { "pid":80,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "not that there aren’t moments of meaning and significance, but that for Wallace, meaning and significance are only things we give to the world — not gifts to be received." },
  { "pid":81,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "One can thus read the Protestant Reformation as refusing and obliterating the distinction by sacralizing what had been previously construed as merely “secular” (Secular Age, pp. 265-66). In short, all is sacred, or at least has the potential of being a sacred vocation if rightly ordered." },
  { "pid":82,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Because we’re not really talking about what people think; it’s more a matter of the difference between what we take for granted — what we don’t give a second thought — and what people of that age took for granted." },
  { "pid":83,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Significance no longer inheres in things; rather, meaning and significance are a property of minds who perceive meaning internally." },
  { "pid":84,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "To be human is to be essentially open to an outside (whether benevolent or malevolent), open to blessing or curse, possession or grace. “This sense of vulnerability,” Taylor concludes, “is one of the principal features which have gone with disenchantment” (p. 36)." },
  { "pid":85,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "he buffered self is essentially the self which is aware of the possibility of disengagement” (pp. 41-42)." },
  { "pid":86,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Once individuals become the locus of meaning, the social atomism that results means that disbelief no longer has social consequences. “We” are not a seamless cloth, a tight-knit social body; instead, “we” are just a collection of individuals — like individual molecules in a social “gas.” This diminishes the ripple effect of individual decisions and beliefs. You’re free to be a heretic — which means, eventually, that you’re free to be an atheist." },
  { "pid":87,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "By making room for entirely “religious” vocations such as monks and nuns, the church creates a sort of vicarious class who ascetically devote themselves to transcendence/eternity for the wider social body who have to deal with the nitty-gritty of creaturely life, from kings to peasant mothers (which is why patronage of monasteries and abbeys is an important expression of religious devotion for those otherwise consumed by “worldly” concerns)." },
  { "pid":88,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Here again, the equilibrium between mundane demands and eternal requirements is maintained, not by resolving the tension in one direction or another, but by inhabiting the tension. Ideally, the demands and expectations of virtue are not compromised or relaxed or dismissed as untenable — they are just periodically suspended.4 What society recognized was a need for ritualized “anti-structure” (p. 50)." },
  { "pid":89,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "What changes in modernity is that, instead of inhabiting this tension and trying to maintain an equilibrium between the demands of creaturely life and the expectations for eternal life, the modern age generates different strategies for resolving (i.e., eliminating) the tension.5 There are a couple of options: you can either effectively denounce creaturely domestic life and sort of demand monasticism for all (the so-called puritanical option); or you can drop the expectations of eternity that place the weight of virtue on our domestic lives — that is, you can stop being burdened by what eternity/salvation demands and simply frame ultimate flourishing within this world." },
  { "pid":90,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "If people aren’t meeting the bar, you can either focus on helping people reach higher or you can lower the bar. This is why Reform unleashes both Puritanism and the ’60s." },
  { "pid":91,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Taylor notes a link between metaphysics and politics, ontology and statecraft: if nominalism is true, “not only must we alter our model of science — no longer the search for Aristotelian or Platonic form, it must search for relations of efficient causality; but the manipulable universe invites us to develop a Leistungswissen, or a science of control” (p. 113). The result is a monster: a Christianized neo-Stoicism that appends a deity to Stoic emphases on action and control. “Neo-Stoicism is the zig to which Deism will be the zag” (p. 117)." },
  { "pid":92,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Taylor highlights the loss of any coherent place for worship: “the eclipse of certain crucial Christian elements, those of grace and of agape, already changed quite decisively the centre of gravity of this outlook. Moreover, there didn’t seem to be an essential place for the worship of God, other than through the cultivation of reason and constancy” (p. 117)." },
  { "pid":93,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "While we have come to assume that this is just “the way things are,” in fact what we take for granted is contingent and contestable." },
  { "pid":94,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Whereas historically the doctrine of providence assured a benign ultimate plan for the cosmos, with Locke and Smith we see a new emphasis: providence is primarily about ordering this world for mutual benefit, particularly economic benefit. Humans are seen as fundamentally engaged in an “exchange of services,” so the entire cosmos is seen anthropocentrically as the arena for this economy (Secular Age, p. 177)." },
  { "pid":95,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Because eternity is eclipsed, the this-worldly is amplified and threatens to swallow all." },
  { "pid":96,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "“eclipse of grace.”" },
  { "pid":97,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "“by reason and discipline, humans could rise to the challenge and realize it.” The result is a kind of intellectual Pelagianism: we can figure this out without assistance. Oh, God still plays a role — as either the watchmaker who got the ball rolling, or the judge who will evaluate how well we did — but in the long middle God plays no discernible role or function, and is uninvolved (pp. 222-23)." },
  { "pid":98,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "We lose a sense that humanity’s end transcends its current configurations — and thus lose a sense of “participation” in God’s nature (or “deification”) as the telos for humanity." },
  { "pid":99,  "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "‘economic’ (that is, ordered, peaceful, productive)" },
  { "pid":100, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "Like the roof on Toronto’s SkyDome, the heavens are beginning to close." },
  { "pid":101, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "We’re so taken with the play on this field, we don’t lament the loss of the stars overhead." },
  { "pid":102, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "we now expect an answer to whatever puzzles us, including the problem of evil. Nothing should be inscrutable." },
  { "pid":103, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "What we have, in other words, is the making of a “civil religion,” rooted in a “natural” religion, which can allegedly transcend denominational strife. (Welcome to America!) The ultimate and transcendent are retained but marginalized and made increasingly irrelevant. Our differences about the ultimate fade in comparison to the common project of pursuing the “order of mutual benefit.”8 What emerges from this is what Taylor describes as “polite society,” a new mode of self-sufficient sociality that becomes an end in itself." },
  { "pid":104, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the “buffered identity,” the self-understanding which arises out of disenchantment." },
  { "pid":105, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "The immanent sphere — the this-worldly plane — swells in importance just to the extent that the eternal and the transcendent are eclipsed. So there’s no lament here; if anything, there is new confidence, excitement, and celebration." },
  { "pid":106, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "The order of mutual benefit offered a moral goal that was experienced as an obligation but was at the same time achievable — and achievable under our own steam, so to speak." },
  { "pid":107, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "secularization of Christian universalism — the call to love the neighbor, even the enemy. If Christianity renounced the tribalisms of paganism, exclusive humanism’s vision of mutual benefit takes that universalizing impulse but now arrogates it to a self-sufficient human capability. We ought to be concerned with others, we ought to be altruistic, and we have the capacity to achieve this ideal." },
  { "pid":108, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "to immanentize this capacity of beneficence.”" },
  { "pid":109, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the new modern social imaginary," },
  { "pid":110, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "According to historic, orthodox Christian faith, “salvation is thwarted to the extent that we treat God as an impersonal being, or as merely the creator of an impersonal order to which we have to adjust. Salvation is only effected by, one might say, our being in communion with God through the community of humans in communion, viz., the church” (pp. 278-79). To depersonalize God is to deny the importance of communion and the community of communion that is the church, home to that meal that is called “Communion.”" },
  { "pid":111, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the “religion” of this impersonal order is also de-Communion-ed, de-ritualized, and disembodied. Taylor helpfully describes this as a process of excarnation. In contrast to the central conviction of Christian faith — that the transcendent God became incarnate, en-fleshed, in Jesus of Nazareth — excarnation is a move of disembodiment and abstraction, an aversion of and flight from the particularities of embodiment (and communion)." },
  { "pid":112, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "So whatever “ascetic” disciplines are required of us “in this life” are not repressions of flourishing but rather constraints for our flourishing." },
  { "pid":113, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "This gave us a way to be rid of eternity and transcendence without giving up a “moral project” — a vision and task that give significance to our striving." },
  { "pid":114, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "those confident secularists2 who would lead us to believe that a “secular” world is a cool, monolithic, “rational” age where everyone who’s anyone (i.e., smart people who are not religious) lives in quiet confidence.2" },
  { "pid":115, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "There’s no going back. Even seeking enchantment will always and only be reenchantment after disenchantment.3" },
  { "pid":116, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "we now have the rise of the evidential argument from evil: if God is all-good and all-powerful, then there shouldn’t be evil. But there is evil. Therefore, this God must not exist. This sort of skeptical argument could only take hold within the modern moral order (MMO) and its epistemic confidence:" },
  { "pid":117, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "“There is a kind of peace in being on my/our (human) own, in solidarity against the blind universe which wrought this horror.”" },
  { "pid":118, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the vertical pressure of transcendence and the horizontal pressure of enchantment — we can’t ignore other reactions that push back against the suffocation of immanence and the hegemony of disenchantment." },
  { "pid":119, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "It’s not that he’s tempted by faith or toying with reenchantment; it’s that ruthless disenchantment seems more than we can bear." },
  { "pid":120, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "As Cormac McCarthy’s narrator says in The Road, “Where you’ve nothing else construct ceremonies out of the air and breathe upon them.” It’s a way to deal with the pressure of the loss." },
  { "pid":121, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "the feeling of loss exerts its own kind of pressure, the strange pressure of an absence. And if that can be felt in the momentous, it can also be felt in the mundane. Indeed, “this can be where it most hurts,” he concedes: “some people feel a terrible flatness in the everyday, and this experience has been identified particularly with commercial, industrial, or consumer society. They feel emptiness of the repeated, accelerating cycle of desire and fulfillment, in consumer culture; the cardboard quality of bright supermarkets, or neat row housing in a clean suburb” (p. 309).11 Material abundance can engender this existential sense of lack precisely because the swelling of immanence seems unable to make up for a pressure we still feel — from transcendence, from enchantment." },
  { "pid":122, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "The dissatisfaction and emptiness can propel a return to transcendence. But often — and perhaps more often than not now? — the “cure” to this nagging pressure of absence is sought within immanence, and it is this quest that generates the nova effect, looking for love/meaning/significance/quasi “transcendence” within the immanent order." },
  { "pid":123, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "we’re not primarily talking about a change in theory, because most people don’t theorize! However, we all do “spontaneously imagine” ourselves in a cosmic context," },
  { "pid":124, "notes":"", "wloc":"", "title":"", "tags":[], "wid":10, "text": "we no longer feel that we “fit” into a cosmos as a cosmic home. Instead we see ourselves adrift and cast into an anonymous, cold “universe”:" },
  { "pid":125, "notes":"", "wloc":"", "title":"", "tags":[], "wid":11, "text": "Always in the past, war has been the specialized function of a particular group within the state, set up and organized for the purpose. But total war is new. By total war is meant that every man, woman and child in the state was somehow involved—also that every conceivable resource of the national life was involved—that every social force was oriented to that end. This meant, and continues to mean, that no one may claim detachment. The result is deep strains and stresses in the soul of a people, for which they had no preparation and from which there seems to be no sure basis for recovery." },
  { "pid":126, "notes":"", "wloc":"", "title":"", "tags":[], "wid":11, "text": "THERE is much discussion concerning what seems to be an increasing restlessness among people. This restlessness takes many forms. Sometimes it appears in easy irritation over matters of little or no consequence. Sometimes it results in the sudden rupturing of old ties of family, job and friends. It may be a general instability making for an unwillingness to assume responsibilities and to fulfill obligations. In its simplest and often most crucial form, it makes concentration on anything difficult because of an apparent futility." },
  { "pid":127, "notes":"", "wloc":"", "title":"", "tags":[], "wid":11, "text": "Augustine, “Thou hast made us for thyself and our souls are restless till they find their rest in Thee.”" },
  { "pid":128, "notes":"", "wloc":"", "title":"", "tags":[], "wid":11, "text": "The present tendency is to make of everyone a scapegoat for our collective fears. This means that we are losing our sense of destiny as a people and are relaxing our faith in the ideals which gave birth to our nation and for whose high fulfillment we have in the past marshaled the resources of our common life. We cannot fight an idea with threats, investigations and scares. We can fight an idea only with a greater idea, to which, in all phases of our life, we are dedicated with high purpose and deep resolve." },
  { "pid":129, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "The one lays a hushing spell on the imagination; the other excites a rapid flutter of the nerves." },
  { "pid":130, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "There is a fear which is twin sister to awe, such as a man in war-time feels when he first comes within sound of the guns; there is a fear which is twin sister to disgust, such as a man feels on finding a snake or scorpion in his bedroom. There are taut, quivering fears (for one split second hardly distinguishable from a kind of pleasurable thrill) that a man may feel on a dangerous horse or a dangerous sea; and again, dead, squashed, flattened, numbing fears, as when we think we have cancer or cholera. There are also fears which are not of danger at all: like the fear of some large and hideous, though innocuous, insect or the fear of a ghost." },
  { "pid":131, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "But that could be contrived without piracy. It is not the mere increase of danger that does the trick. It is the whole image of the utterly lawless enemy, the men who have cut adrift from all human society and become, as it were, a species of their own—men strangely clad, dark men with earrings, men with a history which they know and we don’t, lords of unspecified treasure in undiscovered islands. They are, in fact, to the young reader almost as mythological as the giants. It does not cross his mind that a man—a mere man like the rest of us—might be a pirate at one time of his life and not at another, or that there is any smudgy frontier between piracy and privateering. A pirate is a pirate, just as a giant is a giant." },
  { "pid":132, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "That is one of the functions of art: to present what the narrow and desperately practical perspectives of real life exclude." },
  { "pid":133, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "I have sometimes wondered whether the ‘excitement’ may not be an element actually hostile to the deeper imagination." },
  { "pid":134, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "But the author has no expedient for keeping the story on the move except that of putting his hero into violent danger. In the hurry and scurry of his escapes the poetry of the basic idea is lost." },
  { "pid":135, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "The physical dangers, which are plentiful, here count for nothing: it is we ourselves and the author who walk through a world of spiritual dangers which makes them seem trivial." },
  { "pid":136, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "To construct plausible and moving ‘other worlds’ you must draw on the only real ‘other world’ we know, that of the spirit." },
  { "pid":137, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "The real Moon, if you could reach it and survive, would in a deep and deadly sense be just like anywhere else. You would find cold, hunger, hardship, and danger; and after the first few hours they would be simply cold, hunger, hardship, and danger as you might have met them on Earth. And death would be simply death among those bleached craters as it is simply death in a nursing home at Sheffield. No man would find an abiding strangeness on the Moon unless he were the sort of man who could find it in his own back garden." },
  { "pid":138, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "An unliterary man may be defined as one who reads books once only. There is hope for a man who has never read Malory or Boswell or Tristram Shandy or Shakespeare’s Sonnets: but what can you do with a man who says he ‘has read’ them, meaning he has read them once, and thinks that this settles the matter? Yet I think the test has a special application to the matter in hand. For excitement, in the sense defined above, is just what must disappear from a second reading. You cannot, except at the first reading, be really curious about what happened. If you find that the reader of popular romance—however uneducated a reader, however bad the romances—goes back to his old favourites again and again, then you have pretty good evidence that they are to him a sort of poetry." },
  { "pid":139, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "It is the quality of unexpectedness, not the fact that delight us. It is even better the second time. Knowing that the ‘surprise’ is coming we can now fully relish the fact that this path through the shrubbery doesn’t look as if it were suddenly going to bring us out on the edge of the cliff. So in literature. We do not enjoy a story fully at the first reading. Not till the curiosity, the sheer narrative lust, has been given its sop and laid asleep, are we at leisure to savour the real beauties. Till then, it is like wasting great wine on a ravenous natural thirst which merely wants cold wetness. The children understand this well when they ask for the same story over and over again, and in the same words. They want to have again the ‘surprise’ of discovering that what seemed Little Red Riding Hood’s grandmother is really the wolf. It is better when you know it is coming: free from the shock of actual surprise you can attend better to the intrinsic surprisingness of the peripeteia." },
  { "pid":140, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "To be stories at all they must be series of events: but it must be understood that this series—the plot, as we call it—is only really a net whereby to catch something else. The real theme may be, and perhaps usually is, something that has no sequence in it, something other than a process and much more like a state or quality." },
  { "pid":141, "notes":"", "wloc":"", "title":"", "tags":[], "wid":12, "text": "In life and art both, as it seems to me, we are always trying to catch in our net of successive moments something that is not successive." },
]

};

} // END OF PARA


//***********************************************************************
// EOF
//***********************************************************************
