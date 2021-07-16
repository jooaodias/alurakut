import { SiteClient } from 'datocms-client';

export default async function recebeRequests(req, res) {
  if (req.method === 'POST') {
    const TOKEN = '1fe222da9eebd02930d5d9523bc027';

    const client = new SiteClient(TOKEN);
    const record = await client.items.create({
      itemType: '968554',
      ...req.body,
    });

    res.json({
      dados: 'teste teste',
      record: record,
    });
    console.log(record);

    return;
  }
  res.status(404).json({
    message: 'Ainda não funcionou',
  });
}
