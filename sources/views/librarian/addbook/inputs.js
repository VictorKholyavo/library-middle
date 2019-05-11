export default {
	margin: 10,
	rows: [
		{
			view: "text",
			name: "title",
			label: "Title",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "pages",
			label: "Pages",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "year",
			label: "Year",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "authorName",
			label: "Author name",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "authorSurname",
			label: "Author surname",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "authorPatronymic",
			label: "Author patronymic",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "publisher",
			label: "Publisher",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "country",
			label: "Country",
			labelWidth: 140,
		},
		{
			view: "text",
			name: "availableCount",
			label: "Available count",
			labelWidth: 140,
		},
		{
			view: "richselect",
			label: "Genre 1",
			labelWidth: 140,
			name: "genre_1",
			options:{
				body: {
					template: "#name#",
					url:"http://localhost:3016/books/genres",
				}
			},
		}
	]
};
