var ShortUrls = require('../models/shortUrls.js');
const dns = require('dns');

function makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

const urlMatch = /^[a-z][a-z0-9+\-.]*:\/\/([a-z0-9\-._~%!$&'()*+,;=]+@)?([a-z0-9\-._~%]+|\[[a-f0-9:.]+\]|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])(:[0-9]+)?(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?(\?[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/i

exports.newUrl = function (req, res, next) {

    var url = req.body.url;

    console.log(host);

    if (urlMatch.test(url)) {

        var host = urlMatch.exec(url)[2];

        dns.lookup(host, function (err) {

            if (err) return next({
                message: "invalid url"
            });

            ShortUrls.findOne({
                original_url: url
            }, function (err, data) {

                if (err) return next(err);

                if (data) {

                    res.json(data.toObject());
                } else {

                    var newShortUrl = new ShortUrls({
                        original_url: url,
                        short_url: makeid(6)
                    });
                    newShortUrl.save(function (err, data) {

                        if (err) return next(err);
                        res.json(data.toObject());
                    });
                }
            });
        })
    } else {

        res.json({
            "error": "invalid URL"
        });
    }
}

exports.getUrl = function (req, res, next) {

    ShortUrls.findOne({
        short_url: req.params.short_url
    }, function (err, data) {

        if (err) return next(err);
        if (data) {
            res.redirect(data.original_url);
        }
    })
}