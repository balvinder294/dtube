var isOriginal = false
var isNsfw = false

Template.uploadform.rendered = function () {
  $('.menu .item').tab();
  $('#tagDropdown')
    .dropdown({
      allowAdditions: true
    })
  ;
}

Template.uploadform.helpers({
  mainUser: function () {
    return Users.findOne({ username: Session.get('activeUsername') })
  }
})

Template.uploadform.generateVideo = function () {
  var article = {
    videoId: $('input[name=videohash]')[0].value,
    duration: parseFloat($('input[name=duration]')[0].value),
    title: $('input[name=title]')[0].value,
    description: $('textarea[name=description]')[0].value,
    filesize: parseInt($('input[name=filesize]')[0].value),
    ipfs: {
      snaphash: $('input[name=snaphash]')[0].value,
      spritehash: $('input[name=spritehash]')[0].value,
      videohash: $('input[name=videohash]')[0].value
    }
  }

  if ($('input[name=video240hash]')[0].value.length > 0)
    article.ipfs.video240hash = $('input[name=video240hash]')[0].value
  if ($('input[name=video480hash]')[0].value.length > 0)
    article.ipfs.video480hash = $('input[name=video480hash]')[0].value
  if ($('input[name=video720hash]')[0].value.length > 0)
    article.ipfs.video720hash = $('input[name=video720hash]')[0].value
  if ($('input[name=video1080hash]')[0].value.length > 0)
    article.ipfs.video1080hash = $('input[name=video1080hash]')[0].value
  if ($('input[name=magnet]')[0].value.length > 0)
    article.magnet = $('input[name=magnet]')[0].value

  if (Session.get('tempSubtitles') && Session.get('tempSubtitles').length > 0)
    article.ipfs.subtitles = Session.get('tempSubtitles')

  if (article.ipfs.snaphash) {
    article.thumbnailUrl = 'https://snap1.d.tube/ipfs/'+article.ipfs.snaphash
  }

  if (!article.title) {
    toastr.error(translate('UPLOAD_ERROR_TITLE_REQUIRED'), translate('ERROR_TITLE'))
    return
  }
  if (!article.title.length > 256) {
    toastr.error(translate('UPLOAD_ERROR_TITLE_TOO_LONG'), translate('ERROR_TITLE'))
    return
  }
  if (!article.ipfs.snaphash || !article.thumbnailUrl) {
    toastr.error(translate('UPLOAD_ERROR_UPLOAD_SNAP_FILE'), translate('ERROR_TITLE'))
    return
  }
  if (!article.ipfs.videohash || !article.videoId) {
    toastr.error(translate('UPLOAD_ERROR_UPLOAD_VIDEO_BEFORE_SUBMITTING'), translate('ERROR_TITLE'))
    return
  } else {
    article.providerName = 'IPFS'
  }
  return article
}

Template.uploadformsubmit.events({
  'submit .form': function (event) {
    event.preventDefault()
  },
  'click .editsubmit': function (event) {
    event.preventDefault()
    var video = Videos.findOne({	
      author: FlowRouter.getParam("author"),	
      link: FlowRouter.getParam("permlink")	
    })
    video.json.title = $('input[name=title]')[0].value
    video.json.description = $('textarea[name=description]')[0].value

    broadcast.avalon.comment(FlowRouter.getParam("permlink"), null, null, video.json, null, function(err, result) {
      if (err) toastr.error(Meteor.blockchainError(err))
      else {
        $('#editvideosegment').toggle()
        Template.video.loadState()
      }
    })
  }
})
