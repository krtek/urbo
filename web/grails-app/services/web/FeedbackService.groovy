package web

import groovy.json.JsonBuilder

class FeedbackService {

    def convertToJson(Feedback feedback) {
        return convertToJson([feedback])
    }

    def convertToJson(List<Feedback> feedbacks) {

        def feedbacksConverted = feedbacks.collect { Feedback feedback ->
            [id: feedback.id,
             title: feedback.title,
             description: feedback.description,
             latitude: feedback.location.latitude,
             longitude: feedback.location.longitude,
             authority_response: feedback.authorityResponse]
        }

        def builder = new JsonBuilder(feedbacks: feedbacksConverted)



        return builder.toPrettyString()

    }
}
