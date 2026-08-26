TOKEN=$(npx tsx -e "import { db } from './server/db'; import { channels } from './shared/schema'; db.select().from(channels).then(c => console.log(c[0].accessToken))")
WABA=$(npx tsx -e "import { db } from './server/db'; import { channels } from './shared/schema'; db.select().from(channels).then(c => console.log(c[0].whatsappBusinessAccountId))")

curl -X GET "https://graph.facebook.com/v20.0/$WABA/message_templates" \
-H "Authorization: Bearer $TOKEN"
