package cz.superobcan.web.cz.superobcan

import org.junit.Test
import web.MailJob
import org.junit.Before

class MailJobIntegrationTest extends GroovyTestCase {
    def MailJob mailJob

    @Before
    void setup() {
        mailJob = new MailJob()
    }

    @Test
    void formatBody() {
        def body = mailJob.formatBody("Rozsypaná popelnice", "Všude", "Matěj Brouček")
        assertTrue(body.contains("Rozsypaná popelnice"))
        assertTrue(body.contains("Všude"))
        assertTrue(body.contains("Matěj Brouček"))
    }

}
