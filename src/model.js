async function query(data) {
	let result = []

	try {
		const response = await fetch(
			"https://router.huggingface.co/v1/chat/completions",
			{
				headers: {
					Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
					"Content-Type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(data),
			}
		)
		result = await response.json()
		result = result.choices[0].message.content
	} catch (err) {
		console.log(err)
	}
	return result
}

function generate_prompt(mood, time) {
	return {
		role: "user",
		content: `
		Generate a list of cause in one or two words 
		for the mood: ${mood}/100 
		at the time in the day: ${time} 
		in the strict json format:  {id: int, label: "emoji cause"} 
		without any formating
		`
	}
}


export default async function request(mood, time) {
	let result = await query({
		messages: [generate_prompt(mood, time)],
		model: "openai/gpt-oss-20b:groq"
	})
	result = JSON.parse(result)
	for (let cause of result) {
		cause.selected = false
	}
	return result
}
