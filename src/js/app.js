App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  finalWinner: '',
  highestVote: 0,
  currentVoteCount: 0,
  currentWinner: '',
  overallWinner: '',
  enterLoop: 'true',


  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("final_proj.json", function(final_proj) {
      App.contracts.final_proj = TruffleContract(final_proj);
      App.contracts.final_proj.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.final_proj.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        App.render();
      });
    });
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("GANACHE TEST ACCOUNT => " + App.account);
      }
    });

    App.contracts.final_proj.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var output = $("#output");
      output.empty();

      var choice = $('#chooseCandidate');
      choice.empty();
      var i = 0
      App.currentVoteCount =0;
      
      for (; i <= 1; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          App.enterLoop = 'false';

          var id = candidate[0];
          var name = candidate[1];
          var cons = candidate[2]
          var party = candidate[3];
          var voteCount = candidate[4];
          

          if(voteCount>=App.currentVoteCount && voteCount>0){
          App.currentVoteCount = voteCount;
          App.currentWinner = name;
          }else{
            App.currentWinner = "Harrish";
          }



          var append_item = "<tr><td>" + name + "</td><td>" + cons + "</td><td>"+party+"</td><td>"+ voteCount + "</td></tr>"
          output.append(append_item);
          console.log("winner: "+App.currentWinner);
          console.log("votecount: "+voteCount);
          console.log("App.currentVoteCount: "+App.currentVoteCount);
          
          var radioButton = "<input type='radio' id='male' name='gender' value='"+id+"'>"
          var radioButton_Label = "<label for='male'>"+name+"</label><br>"
          choice.append(radioButton);
          choice.append(radioButton_Label);
        });
      }
    

      return electionInstance.voters(App.account);
    }).then(function(hasVoted) {
      if(hasVoted) {
        $('form').hide();
      }

      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  VoteForCandidate: function() {
    var radioButtons = document.getElementsByName("gender");
    for(var i = 0; i < radioButtons.length; i++)
    {
        if(radioButtons[i].checked == true)
        {

          id = radioButtons[i].value;
        }
    }
 
    App.contracts.final_proj.deployed().then(function(instance) {
      electionInstance = instance;
      return instance.vote(id, { from: App.account });
    }).then(function(result) {
      
      for (var i=0; i <= 1; i++) {
        electionInstance.candidates(i).then(function(candidate) {
          App.enterLoop = 'false';

          var name = candidate[1];
          var voteCount = candidate[4];
          

          if(voteCount>=App.currentVoteCount && voteCount>0){
          App.currentVoteCount = voteCount;
          App.currentWinner = name;
          }


          console.log("winner 1: "+App.currentWinner);
          console.log("votecount 1: "+voteCount);
          console.log("App.currentVoteCount 1: "+App.currentVoteCount);
          

        });
      }
      


      var after_tag = $('#after_tag');
      var log = "Your vote has been registered ";
      var attach = "<p>"+log+"</p></br>"
      after_tag.append(attach);
      var winner_log = "Current winner is "+App.currentWinner;
      var winner_attachment = "<p>"+winner_log+"</p>"
      after_tag.append(winner_attachment);
      $("#content").hide();
      $("#loader").show();


    }).catch(function(err) {
      console.error(err);
    });
  },


  finalResult: function() {
    var winner_tag = $('#winner_tag');
    var winner_log = "Winner is :"+result;
    var attach = "<p>"+winner_log+"</p>";
    winner_tag.append(attach);

  //   App.contracts.final_proj.deployed().then(function(instance) {
  //     return instance.winner();
  //   }).then(function(result) {
  //     // Wait for votes to update
  //     var winner_tag = $('#winner_tag');
  //     var winner_log = "Winner is :"+result;
  //     var attach = "<p>"+winner_log+"</p>"
  //     winner_tag.append(attach);
  //     $("#content").hide();
  //     $("#loader").show();


  //   }).catch(function(err) {
  //     console.error(err);
  //   });
  // }

    // var winner_tag = $('#winner_tag');
    // var log = "Winner is "+overallWinner;
    // var attach = "<p>"+log+"</p>"
    // winner_tag.append("Winner is: "+attach);
    // $("#content").hide();
    // $("#loader").show();

  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});