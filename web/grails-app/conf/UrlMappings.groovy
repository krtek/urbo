class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

        "/admin/case"(controller: "feedbackCrud")
        "/admin/author"(controller:  "authorCrud")

        "/api/v1/case"(controller: "feedback") {
            action = [GET: "findAll", POST: "save"]
        }
        "/api/v1/case/$id"(controller: "feedback", action: "findById")

        "/api/v1/"(controller: "apiHelp")

		"/"(view:"/index")
		"500"(view:'/error')
	}
}
