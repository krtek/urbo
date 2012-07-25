package web

import cz.superobcan.web.FeedbackTestUtils
import grails.test.MockUtils
import grails.test.mixin.*
import org.apache.commons.lang.StringUtils
import api.ApiFeedbackController
/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(ApiFeedbackController)
@Mock([Feedback])
class ApiFeedbackControllerTests {

    void testFindAllJsonResponse() {

        /*
            When using TestFor only a subset of the Spring beans available to a running Grails application are
            available. If you wish to make additional beans available you can do so with the defineBeans method of
            GrailsUnitTestMixin (@TestFor do it for you)
         */
        defineBeans {
             feedbackService(FeedbackService)
        }

        /* otherwise Feedback.list() called in controller findAll throws NPE as Feedback is not initialized at all */
        MockUtils.mockDomain(Feedback, FeedbackTestUtils.createTestingFeedbacks())

        /* controller instance is injected by @TestFor annotation automatically */
        controller.findAll()

        def expectedJsonResponse = """
                                        {
                                            "feedbacks": [
                                                {
                                                    "id": 1,
                                                    "title": "přechod pro chodce má zelenou moc krátce",
                                                    "description": null,
                                                    "latitude": 50.076,
                                                    "longitude": 14.408,
                                                    "authority_response": null
                                                },
                                                {
                                                    "id": 2,
                                                    "title": "někdo hodil karamelovýho draka do pisoáru",
                                                    "description": "děsně to zapáchá",
                                                    "latitude": 50.07647,
                                                    "longitude": 14.40216,
                                                    "authority_response": null
                                                },
                                                {
                                                    "id": 3,
                                                    "title": "rozsypaná popelnice",
                                                    "description": null,
                                                    "latitude": 50.02678,
                                                    "longitude": 14.43455,
                                                    "authority_response": null
                                                }
                                            ]
                                        }

                                    """

        String.metaClass.deleteWhitespace = StringUtils.&deleteWhitespace

        assert response.text.deleteWhitespace() == expectedJsonResponse.deleteWhitespace()

    }



}
