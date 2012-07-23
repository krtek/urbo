package cz.superobcan.web.cz.superobcan

import api.FeedbackController
import web.Feedback


class FeedbackControllerIntegrationTest extends GroovyTestCase {

    def testSaveApiWithJson() {

        def controller = new FeedbackController()

        controller.request.contentType = "text/json"
        controller.request.content = """

            {
                "feedback":
                    {
                        "title": "přechod pro chodce má zelenou moc krátce",
                        "description": null,
                        "latitude": 50.076,
                        "longitude": 14.408,
                        "photo_id": ""
                    }
            }

        """.getBytes("utf-8")

        controller.request.method = "POST"

        controller.save()

        assert Feedback.list().size() == 1

    }

}
