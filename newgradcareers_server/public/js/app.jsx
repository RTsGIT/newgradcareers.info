var data;
  var Company = React.createClass({
    getInitialState:function(){
      return {color:'col-xs-12 col-md-6 page-scroll panel panel-default'};
    },
    onCompanyClick: function(evt){
      if(evt.target.tagName=="DIV" || evt.target.tagName=="H4")
      this.props.onSelect(this.props.name);

      // this.setState({color:'panel panel-default'});
      // location.href='#team?name='+evt.target.id;
      // $('#team').removeClass("hidden");
      // $('#companies').addClass("hidden");
      // $('#contact').addClass("hidden");
      $('html, body').animate({
                 scrollTop: $("#ReactContent").offset().top
             }, 200);
    },
    render:function(){
      var btnNewgrad;
      if(this.props.newgrad){
        btnNewgrad = <a href={this.props.newgrad} target="_blank" className="btn btn-primary btn-sm">New Grad </a>;
      }
      return(
          <div className={this.state.color} id="companyItem"   onClick={this.onCompanyClick}>
            <div className='panel-heading clearfix' id={this.props.id}>
                <h4 className="panel-title pull-left">{this.props.name}</h4>

              <div className=" btn-group pull-right vertical-center">
                {btnNewgrad}
                <a href={this.props.careers} target="_blank" className="btn btn-info btn-sm">Careers</a>
              </div>
              </div>
          </div>
      );
    }
  });

  var CompaniesList = React.createClass({


    render: function(){
      var self = this;
      var companyNodes = this.props.data.map(function(company){
        return (
          <Company onSelect={self.props.onSelect} key={company[0]} name={company[1]} id={company[0]} careers={company[2]} newgrad={company[3]}/>
        )
      });
      return(
        <div className="companiesList">

       {companyNodes}

        </div>
      );
    }
  });

  var CompanyBox = React.createClass({
    getInitialState:function(){
      return {initialData:[],data:[]};
    },
    filterList: function(event){
      var updatedList = this.state.initialData;
      updatedList = updatedList.filter(function(item){
        //console.log(item);
        console.log(  event.target.value.toLowerCase());
        return item[1].toLowerCase().startsWith(
          event.target.value.toLowerCase());
        });
        this.setState({data: updatedList});
      },
    componentDidMount: function(){
      $.ajax({
        url: this.props.url,
        async: true,
        success: function(csvd) {
          data = $.csv2Array(csvd);
        }.bind(this),
        dataType: "text",
        complete: function() {
          // call a function on complete
          this.setState({initialData:data});
          this.setState({data:data});
        }.bind(this)
      });
    },
    render: function(){
      return(
        <div className="container">

          <div className="text-center">
            <h2 className="section-heading">Companies</h2>
            <h3 className="section-subheading text-muted">List of companies with Engineering positions <br/><hr/> Did you know that most of the companies have separate page for new grads to apply ? Here is the list for you. </h3>
          </div>


        <div className="form-group" >
          <input type="text" className="form-control" placeholder="Search" onChange={this.filterList}/>
          </div>
          <CompaniesList data={this.state.data} onSelect={this.props.onSelect}/>
        </div>
      );
    }
  });

var posts = [];

// building company statep
var CompanySpace = React.createClass({
  backToListClick:function(){
    this.props.onBack();
  },
  render: function(){
    return(
      <div className="container">
        <div className="row">
          <div id="btnBackToList" className="well col-md-3 col-lg-2 btn btn-defult"  onClick={this.backToListClick}>
                  <span className="glyphicon glyphicon-arrow-left"></span> Back
          </div>
        </div>
        <div className="row">
              <div className="col-lg-12 text-center">
                  <h3 className="section-heading">{this.props.name}</h3>
                    <h4 className="section-subheading text-muted">Add your queries or experience over here.</h4>
              </div>
        </div>
        <div className="row">
              <CommentBox  posts={posts} name={this.props.name} />
        </div>
      </div>
    );
  }
});

var Playground = React.createClass({
  getInitialState: function(){
    return { flag:"showList", company:""};
  },
  handleSelect: function(i){
    this.setState({flag:"showCompany", company:i});
  },
  getBack: function(i){
    this.setState({flag:"showList", company:""});
  },
  render: function(){
    if(this.state.flag=="showList")
    return(
        <CompanyBox onSelect={this.handleSelect} url="positions.csv" />
    );
    else
    return(
      <CompanySpace name={this.state.company} onBack={this.getBack}> </CompanySpace>
    );
  }
});




var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
  $.ajax({
    url: '/api?name='+this.props.name,
    dataType: 'json',
    cache: false,
    success: function(data) {
      this.setState({posts: data});
    }.bind(this),
    error: function(xhr, status, err) {
      console.error('/api', status, err.toString());
    }.bind(this)
  });
},
  getInitialState: function() {
    return {posts: []};
  },
  componentDidMount: function(){
    this.setState({posts:posts});
    this.loadCommentsFromServer();
  },
  handleCommentSubmit: function(comment) {
   // TODO: submit to the server and refresh the list
     var comments = this.state.posts;
     comment._id = Date.now();
     var newComments = comments.concat(comment);
     this.setState({posts: newComments});
     comment['company'] = this.props.name;
     $.ajax({
       url: "/api",
       dataType: 'json',
       type: 'POST',
       data: comment,
       success: function(data) {
         this.setState({data: data});
       }.bind(this),
       error: function(xhr, status, err) {
         this.setState({data: comments});
         console.error(this.props.url, status, err.toString());
       }.bind(this)
     });
 },
  render: function() {
    return (
      <div className="panel panel-info">
        <div className="panel-body">
          <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
          <hr/>
          <CommentList posts={this.state.posts} />

        </div>
      </div>
    );
  }
});


var CommentList = React.createClass({
  render: function() {
    var sortedNodes =  this.props.posts.sort(function(a, b) {
      return (a.id - b.id);
    });
    var commentNodes = sortedNodes.map(function(comment) {
    return (

      <Comment user={comment.user} key={comment._id}>
        {comment.post}
      </Comment>

    );
  });
    return (
      <div className="commentList">
      <ul className="media-list">
        {commentNodes}
     </ul>
   </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {user: '', post: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({user: e.target.value});
  },
  handleTextChange: function(e) {
    this.setState({post: e.target.value});
  },
  handleSubmit: function(e) {
     e.preventDefault();
     var user = this.state.user.trim();
     var post = this.state.post.trim();
     if (!post || !user) {
       return;
     }
     // TODO: send request to the server
     this.props.onCommentSubmit({user: user, post: post});
     this.setState({user: '', post: ''});
   },
  render: function() {
    return (
      <form className="commentForm form-group" onSubmit={this.handleSubmit}>
      <div className="row" style={{padding:10+'px'}}><div className="col-lg-12">
      <input
        className ="form-control"
        type="text"
        placeholder="Name or just be anonymous"
        value={this.state.user}
        onChange={this.handleAuthorChange}
        required data-validation-required-message="Please enter your name."
      />
      <textarea
          rows="3"
          className ="form-control"
          placeholder="Enter here ..."
          value={this.state.post}
          onChange={this.handleTextChange}
          required data-validation-required-message="Please enter your name."
        /></div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <input type="submit" className= "btn btn-primary btn-lg" value="Post" />
          </div>
        </div>
   </form>
    );
  }
});

var Comment = React.createClass({
render: function() {
  return (
    <li>
    <div className="panel">
    <div className="comment media-body">
      <strong className="commentAuthor text-success">
        @{this.props.user}
      </strong>
      <p>{this.props.children}</p>
    </div>
    </div>
    </li>
  );
}
});

 ReactDOM.render(
    <Playground />,
    document.getElementById('ReactContent')
  );
