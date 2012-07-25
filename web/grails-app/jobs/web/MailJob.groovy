package web

import cz.superobcan.web.FeedbackState

class MailJob {
    static triggers = {
      simple repeatInterval: 10 * 1000L // execute job once in 5 seconds
    }

    //injected automagically
    def mailService
    def markdownService

    def execute() {
        def readyToSend = findReadyFeedbacks()
        readyToSend.each {feedback ->
            mailService.sendMail {
                multipart true
                to "lukas.marek@gmail.com"
                subject formatSubject(feedback.title)
                html formatBody(feedback.title, feedback.description, feedback.author.toString())
                if (feedback.photo) {
                    attachBytes "obrazek.jpg",'image/jpg', feedback.photo.data
                }
            }
            feedback.state = FeedbackState.SENT_TO_AUTHORITY
            feedback.save()
        }
    }

    def List<Feedback> findReadyFeedbacks() {
        Feedback.findAllByState(FeedbackState.READY_TO_SEND)
    }

    static def String formatSubject(String title) {
        "[Urbo] ${title}".toString()
    }

    def String formatBody(String title, String description, String author) {
        String message = """\
<link href=\"http://kevinburke.bitbucket.org/markdowncss/markdown.css\" rel=\"stylesheet\"></link>
Dobrý den,
obracíme se na Vás jménem spoluobčana, který zadal do systému [Urbo](http://urbo.cz) následující problém:

## Věc: ${title}
### Detailní popis:
${description}

S pozdravem,
${author} a [Urbo](http://urbo.cz)
"""

        message.markdownToHtml()
    }
}
