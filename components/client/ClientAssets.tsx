
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { ClientProfile } from '../../types.ts';

interface ClientAssetsProps {
  client: ClientProfile;
}

const ClientAssets: React.FC<ClientAssetsProps> = ({ client }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {client.assets.map(asset => (
        <div key={asset.id} className="glass-panel p-4 rounded-[2.5rem] border border-white/5 group transition-all hover:scale-105 bg-black/20 shadow-xl overflow-hidden">
           <div className="aspect-square bg-slate-900 rounded-[2rem] overflow-hidden mb-4 border border-white/5 relative">
              <img src={asset.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" alt={asset.title} />
              <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                 <button className="bg-white p-3 rounded-xl text-black hover:scale-110 transition-transform"><Download size={18}/></button>
                 <button className="bg-white p-3 rounded-xl text-black hover:scale-110 transition-transform"><ExternalLink size={18}/></button>
              </div>
           </div>
           <p className="text-[10px] font-black text-white uppercase px-2 truncate">{asset.title}</p>
           <p className="text-[8px] font-bold text-slate-600 px-2 uppercase tracking-widest mt-1">{asset.date}</p>
        </div>
      ))}
      {client.assets.length === 0 && (
        <div className="col-span-full border-2 border-dashed border-white/5 rounded-[3rem] p-32 text-center opacity-30">
          <p className="text-xs font-black uppercase tracking-widest">Henüz paylaşılan bir varlık yok.</p>
        </div>
      )}
    </div>
  );
};

export default ClientAssets;
