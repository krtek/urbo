package api

import groovy.json.JsonBuilder
import web.Feedback

class FeedbackController {

    def feedbackService

    def index() {
        findAll()
    }

    def findAll() {
        def feedbacks = Feedback.list()
        def feedbacksAsJson = feedbackService.convertToJson(feedbacks)
        render(contentType: "application/json", text: feedbacksAsJson)
    }

    def findById() {
        def feedbackParam = params.id
        def feedback = Feedback.findById(feedbackParam)

        if (feedback == null) {

           //TODO michal : tbd reaction of api error (ie. nothing found)

        }
        else {
            def feedbacksAsJson = feedbackService.convertToJson(feedback)
            render(contentType: "application/json", text: feedbacksAsJson)
        }



    }



}
