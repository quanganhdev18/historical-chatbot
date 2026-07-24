export const STORY_BATRIEU = {
  // HỒI 1: NĂM 248 - LỜI THỀ TRÊN NÚI NƯA
  start: {
    chapter: "HỒI 1: LỜI THỀ TRÊN NÚI NƯA (NĂM 248)",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    text: "Năm 248, Đông Ngô áp đặt ách cai trị hà khắc lên Giao Châu. Tại ngàn Nưa, Triệu Thị Trinh đứng trước ngã rẽ định mệnh. Trưởng tộc ép nàng làm tì thiếp cho viên quan thú Đông Ngô để đổi lấy sự bình yên giả tạo cho gia tộc. Trong gian phòng tĩnh lặng, ánh nến leo lắt chiếu lên khuôn mặt kiên nghị của nàng. Nàng nhìn bạn, vị quân sư tâm giao. 'Ta thà ngọc nát còn hơn ngói lành. Nhưng sinh mạng của cả gia tộc đang đè nặng lên vai ta.'",
    choices: [
      { label: "⚔️ [QUYẾT BẤT KHẤU] Rút gươm chém góc bàn, dấy binh khởi nghĩa bất chấp sự phản đối", nextId: "act1_heroic_path" },
      { label: "📜 [TƯƠNG KẾ TỰU KẾ] Giả vờ ưng thuận, dùng chính sính lễ của giặc để chiêu binh mãi mã", nextId: "act1_tactical_path" }
    ]
  },

  act1_heroic_path: {
    chapter: "NHÁNH 1: HÙNG KHÍ BỒ ĐIỀN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    text: "(Lưỡi gươm sáng loáng vung lên, góc bàn bằng gỗ lim rụng xuống) 'Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông! Chứ không chịu khom lưng làm tì thiếp cho người!' Lời thề vang vọng, nhưng ánh mắt nàng thoáng một tia đau đớn khi thấy anh trai Triệu Quốc Đạt lắc đầu quay đi. Nàng biết, con đường này sẽ phải trả giá bằng rất nhiều máu.",
    choices: [
      { label: "🐘 [THUẦN PHỤC VOI TRẮNG] Một mình vào rừng sâu, dùng nhu thắng cương thuần phục Voi Thần", nextId: "act2_elephant_battle" },
      { label: "🔥 [HỎA CÔNG BỒ ĐIỀN] Dùng chiến thuật du kích, tập kích kho lương giặc ngay trong đêm", nextId: "act2_fire_siege" }
    ]
  },

  act2_elephant_battle: {
    chapter: "NHÁNH 1A: THUẦN PHỤC VOI THẦN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    text: "Đối mặt với Voi Trắng hung bạo, nàng không dùng vũ lực mà dùng sự kiên nhẫn và lòng trắc ẩn để cảm hóa. Ngày xuất quân, nàng mặc áo giáp vàng, cưỡi Voi Trắng, uy phong lẫm liệt. Lục Dẫn, tướng giặc, nhìn thấy cảnh ấy mà khiếp đảm. Nhưng bên trong, nàng nhận ra binh lực Đông Ngô quá đông, một trận chiến vỗ mặt có thể là mồ chôn của nghĩa quân.",
    choices: [
      { label: "⚡ [MỞ ĐƯỜNG MÁU] Bỏ qua cạm bẫy, lao thẳng kiệu voi vào trung quân trảm Lục Dẫn", nextId: "ending_batrieu_heroic_victory" },
      { label: "🚩 [TUẪN TIẾT NÚI TÙNG] Chấp nhận hy sinh, ở lại cầm chân đại quân giặc để nghĩa quân rút lui", nextId: "ending_batrieu_historical" }
    ]
  },

  act2_fire_siege: {
    chapter: "NHÁNH 1B: HỎA CÔNG BỒ ĐIỀN",
    speaker: "Quân Sư (Bạn)",
    avatar: "⚔️",
    emotion: "heroic",
    text: "Lửa cháy rực trời Bồ Điền. Tuy nhiên, một sự thật kinh hoàng được phơi bày: Lục Dẫn đã đoán trước được hỏa công, hắn để lại kho lương giả chứa đầy thuốc nổ! Nghĩa quân rơi vào ổ phục kích. Bà Triệu phải đưa ra quyết định tàn nhẫn nhất trong đời: cứu cánh quân tiên phong hay hy sinh họ để bảo toàn lực lượng chủ chốt.",
    choices: [
      { label: "🏹 [QUYẾT TỬ CỨU VIỆN] Dẫn quân chủ lực quay lại vòng vây máu lửa cứu anh em", nextId: "ending_batrieu_fire_victory" },
      { label: "🏰 [RÚT VỀ CỬU CHÂN] Nuốt nước mắt bỏ lại tiền quân, lui về xây dựng thành trì", nextId: "ending_batrieu_sovereignty" }
    ]
  },

  act1_tactical_path: {
    chapter: "NHÁNH 2: TÍCH TRỮ LỰC LƯỢNG",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "solemn",
    text: "(Nở nụ cười chua xót) 'Ta sẽ mặc áo hỉ, nhận sính lễ.' Đêm đêm, những hòm vàng bạc của giặc được bí mật tuồn ra ngàn Nưa để đúc vũ khí. Nhưng Lục Dẫn không phải kẻ ngu. Hắn sai tâm phúc cài vào làm tì nữ cho nàng. Nàng biết mình đang chơi đùa với lửa, mỗi lời nói, mỗi bước đi đều nằm trên lưỡi dao.",
    choices: [
      { label: "🤝 [TƯƠNG KẾ TỰU KẾ] Mua chuộc chính tì nữ của Lục Dẫn, tuồn tin giả", nextId: "act2_allied_rebellion" },
      { label: "🕸️ [BẪY TÌNH THÂM] Dùng chính lễ rước dâu để dẫn Lục Dẫn vào ổ mai phục", nextId: "act2_ambush_trap" }
    ]
  },

  act2_allied_rebellion: {
    chapter: "NHÁNH 2A: KHỞI NGHĨA TOÀN DÂN",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "heroic",
    text: "Lục Dẫn trúng kế, điều quân rời khỏi phủ thành. Hàng vạn dân đinh Cửu Chân chờ sẵn, nhất tề nổi dậy. Tuy nhiên, trong hàng ngũ nghĩa quân xuất hiện kẻ phản bội mở cổng thành phụ cho giặc. Bà Triệu bàng hoàng nhận ra, đó chính là một vị trưởng lão trong họ tộc vì sợ hãi mà lén lút hàng Ngô. Nàng đứng trước nguy cơ bị đánh úp từ bên trong.",
    choices: [
      { label: "🏆 [HUYẾT CHIẾN PHỦ THÀNH] Đích thân dẫn cấm vệ quân truy tìm và tiêu diệt kẻ phản bội", nextId: "ending_batrieu_liberation" },
      { label: "🛡️ [BỎ THÀNH RÚT LUI] Áp dụng chiến thuật vườn không nhà trống, rút lên ngàn Nưa bảo toàn lực lượng", nextId: "ending_batrieu_guerrilla_legend" }
    ]
  },

  act2_ambush_trap: {
    chapter: "NHÁNH 2B: BẪY HOA HỒNG",
    speaker: "Quân Sư (Bạn)",
    avatar: "⚔️",
    emotion: "heroic",
    text: "Lễ rước dâu biến thành biển máu. Lục Dẫn lọt vào hẻm Quan Yên. Nhưng hắn vạch áo, để lộ lớp giáp sắt bên trong. Hắn đã biết trước! Một cuộc đấu trí và lực lượng diễn ra ác liệt. Bà Triệu bị thương ở vai, máu nhuộm đỏ chiếc áo tân nương.",
    choices: [
      { label: "💥 [LIỀU MÌNH QUYẾT SÁT] Dùng thân mình làm mồi nhử, kích nổ bãi đá sập", nextId: "ending_batrieu_trap_victory" },
      { label: "🕊️ [BẮT SỐNG TƯỚNG GIẶC] Áp sát thi triển võ nghệ, kề gươm vào cổ Lục Dẫn ép hàng", nextId: "ending_batrieu_diplomatic_triumph" }
    ]
  },

  // Endings for Bà Triệu
  ending_batrieu_heroic_victory: {
    chapter: "KẾT CỤC 1A: HÙNG KHÍ NÂNG BẰNG",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "🏆 ĐẠI PHÁ ĐÔNG NGÔ",
      type: "victory",
      desc: "Trảm Tướng Lục Dẫn tại Bồ Điền. Nhưng niềm vui không trọn vẹn, anh trai nàng đã tử trận trong loạn quân. Bà Triệu gạt nước mắt, lên ngôi vị nữ vương, mang nỗi cô đơn của người đứng trên đỉnh cao quyền lực."
    },
    text: "(Nhìn thi hài anh trai, giọng nghẹn ngào nhưng kiên định) 'Non sông đã sạch bóng thù, nhưng máu thịt ta đã hòa vào đất mẹ.'"
  },

  ending_batrieu_historical: {
    chapter: "KẾT CỤC 1B: BẤT TỬ TRONG LỊCH SỬ",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    ending: {
      title: "🕊️ ANH LINH BẤT TỬ",
      type: "historical",
      desc: "Năm 248, Bà Triệu tuẫn tiết trên đỉnh núi Tùng. Nàng chọn cái chết để không sa vào tay giặc, giữ trọn vẹn khí tiết. Trước khi gieo mình, nàng mỉm cười mãn nguyện vì đã sống một đời không hối tiếc."
    },
    text: "Gió núi Tùng gào thét như khóc thương người nữ anh hùng, nhưng cũng là khúc tráng ca muôn thuở của tự do."
  },

  ending_batrieu_fire_victory: {
    chapter: "KẾT CỤC 1C: HỎA CÔNG ĐẪM MÁU",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "🔥 THẮNG LỢI TRONG NƯỚC MẮT",
      type: "victory",
      desc: "Quyết tử cứu viện thành công, nhưng nghĩa quân tổn thất hơn phân nửa. Bà Triệu giành được Bồ Điền nhưng bị ám ảnh mãi bởi tiếng thét của những người anh em trong biển lửa."
    },
    text: "Bồ Điền rực lửa. Giặc đã tan, nhưng trái tim ta vĩnh viễn mang một vết sẹo không thể xóa nhòa."
  },

  ending_batrieu_sovereignty: {
    chapter: "KẾT CỤC 1D: CĂN CỨ TỰ CHỦ",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "🏰 THÀNH TRÌ CỦA SỰ DẰN VẶT",
      type: "historical",
      desc: "Bà Triệu xây dựng thành trì Cửu Chân tự chủ. Bà trở thành một nhà lãnh đạo sắt đá, lạnh lùng, luôn mang trong mình mặc cảm tội lỗi vì đã bỏ rơi quân tiên phong."
    },
    text: "Giang sơn được giữ vững, nhưng mỗi đêm ta vẫn nghe tiếng gọi của họ từ cõi chết vọng về."
  },

  ending_batrieu_liberation: {
    chapter: "KẾT CỤC 2A: GIẢI PHÓNG GIAO CHÂU",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "🏆 GIAO CHÂU ĐỘC LẬP",
      type: "victory",
      desc: "Kẻ phản bội chính là người thân của nàng. Tự tay trừng trị máu mủ, Bà Triệu giải phóng Giao Châu, thiết lập một chính quyền nghiêm minh, không khoan nhượng."
    },
    text: "Pháp luật vô tình. Ta phải tự tay chặt đi cành sâu để cứu lấy cái cây đại thụ mang tên Giao Châu."
  },

  ending_batrieu_guerrilla_legend: {
    chapter: "KẾT CỤC 2B: NGÀN NƯA HUYỀN THOẠI",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    ending: {
      title: "🛡️ HUYỀN THOẠI DU KÍCH",
      type: "historical",
      desc: "Rút về ngàn Nưa, Bà Triệu trở thành bóng ma ám ảnh quân Ngô. Nàng hy sinh hạnh phúc cá nhân, hóa thân thành thần rừng bảo vệ quê hương."
    },
    text: "Người ta không còn thấy Bà Triệu bằng xương bằng thịt, chỉ thấy nỗi khiếp sợ gieo rắc lên đầu kẻ thù từ những bóng cây."
  },

  ending_batrieu_trap_victory: {
    chapter: "KẾT CỤC 2C: HUYẾT CHIẾN QUAN YÊN",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "💥 ĐẠI TRÚT ĐÁ SẬP",
      type: "victory",
      desc: "Bãi đá sập chôn vùi cả Lục Dẫn và một cánh tay của Bà Triệu. Nàng trở thành vị nữ vương độc thủ, biểu tượng của sự hy sinh tột cùng cho tự do."
    },
    text: "Một cánh tay đổi lấy ngàn năm độc lập. Cái giá này, Triệu Thị Trinh ta nguyện trả!"
  },

  ending_batrieu_diplomatic_triumph: {
    chapter: "KẾT CỤC 2D: HÒA BÌNH TRÊN LƯỠI GƯƠM",
    speaker: "Bà Triệu",
    avatar: "👸",
    emotion: "heroic",
    ending: {
      title: "🕊️ NGOẠI GIAO HÒA BÌNH",
      type: "historical",
      desc: "Bắt sống Lục Dẫn, ép Đông Ngô ký hòa ước. Bà Triệu nhận ra chiến tranh không chỉ giải quyết bằng gươm đao, mà bằng cả một cái đầu lạnh."
    },
    text: "Máu đã đổ đủ rồi. Hôm nay, ta dùng mạng sống của ngươi để mua lấy hòa bình cho bách tính."
  }
};

export const STORY_LELOI = {
  // HỒI 1: NĂM 1416 - HỘI THỀ LŨNG NHAI
  start: {
    chapter: "HỒI 1: HỘI THỀ LŨNG NHAI (NĂM 1416)",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    text: "Năm 1416. Đất nước chìm trong tăm tối dưới ách đô hộ của nhà Minh. Tại Lam Sơn, Lê Lợi cùng 18 anh hùng cắt máu ăn thề. Nhưng sâu thẳm trong mắt Lê Lợi là một nỗi lo âu tột độ. Ông biết, trong số những người vừa cạn chén máu, có kẻ đang dao động trước uy quyền và tiền bạc của giặc. Một nước cờ sai, toàn bộ gia tộc và huynh đệ sẽ bị tru di.",
    choices: [
      { label: "🗡️ [CỐ THỦ CHÍ LINH] Lùi sâu vào núi rừng Chí Linh, dùng hiểm địa để rèn quân", nextId: "act1_oath_path" },
      { label: "🏹 [TẤN CÔNG NGHỆ AN] Bất ngờ tiến công Nghệ An, đánh một trận phủ đầu gây tiếng vang", nextId: "act1_nghean_path" }
    ]
  },

  act1_oath_path: {
    chapter: "NHÁNH 1: ĐÊM ĐEN CHÍ LINH",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    text: "Quân Minh bao vây núi Chí Linh. Lương thực cạn kiệt, binh sĩ phải ăn rễ cây, măng dại. Nỗi tuyệt vọng bao trùm. Một đêm, Lê Lợi phát hiện một mật thư gửi cho quân Minh rơi gần lán của một vị tướng thân tín. Niềm tin sụp đổ. Ông phải đưa ra quyết định: vạch trần kẻ phản bội và làm lung lay tinh thần quân sĩ, hay âm thầm tự mình gánh vác?",
    choices: [
      { label: "👑 [LÊ LAI CỨU CHỦ] Ép kẻ phản bội phải lập công chuộc tội, cùng Lê Lai giả vương phá vây", nextId: "act2_lelai_sacrifice" },
      { label: "⚔️ [TỰ MỞ ĐƯỜNG MÁU] Tiêu diệt kẻ phản bội trong im lặng, tự mình dẫn quân cảm tử xông pha", nextId: "act2_chiling_breakthrough" }
    ]
  },

  act2_lelai_sacrifice: {
    chapter: "NHÁNH 1A: MÁU NHUỘM HOÀNG BÀO",
    speaker: "Lê Lai",
    avatar: "🗡️",
    emotion: "heroic",
    text: "(Khoác lên mình chiếc áo hoàng bào, Lê Lai mỉm cười thanh thản) 'Thần nguyện chết thay chúa công.' Nhưng Lê Lợi biết, Lê Lai không chỉ chết vì trung thành, mà còn mang theo bí mật về kẻ phản bội xuống mồ để bảo vệ danh dự cho khởi nghĩa. Nỗi đau giằng xé tâm can Lê Lợi khi nhìn bóng huynh đệ khuất dần trong vòng vây giặc.",
    choices: [
      { label: "🗡️ [TRẢM LIỄU THĂNG] Kìm nén bi thương, giăng bẫy ở Chi Lăng để báo thù", nextId: "ending_leloi_chilang_triumph" },
      { label: "📜 [HỘI THỀ ĐÔNG QUAN] Dùng cái chết của Lê Lai để thức tỉnh kẻ thù, chọn con đường hòa đàm", nextId: "ending_leloi_peace" }
    ]
  },

  act2_chiling_breakthrough: {
    chapter: "NHÁNH 1B: ĐƯỜNG MÁU",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    text: "Lê Lợi tự tay hạ sát kẻ phản bội. Bàn tay ông run rẩy nhuộm máu người từng là anh em. Đêm đó, ông dẫn quân phá vây. Trương Phụ không ngờ Lê Lợi lại liều mạng đến vậy. Trận chiến đẫm máu, Lê Lợi bị thương nặng, nhưng quân Lam Sơn đã thoát khỏi tử địa. Sự tàn nhẫn của chiến tranh đã biến một tù trưởng nhân hậu thành một vị tướng sắt đá.",
    choices: [
      { label: "🏆 [ĐẠI PHÁ QUÂN MINH] Thừa thắng xông lên, truy kích Trương Phụ tới cùng", nextId: "ending_leloi_emperor" },
      { label: "🚩 [THUẬN THIÊN BẢO HÙNG] Rút vào rừng sâu dưỡng thương, chờ đợi cơ hội mới", nextId: "ending_leloi_legend" }
    ]
  },

  act1_nghean_path: {
    chapter: "NHÁNH 2: NGHỆ AN CHIẾN LƯỢC",
    speaker: "Nguyễn Chích",
    avatar: "📜",
    emotion: "heroic",
    text: "Quyết định tấn công Nghệ An là một nước cờ điên rồ nhưng thiên tài. Tuy nhiên, khi đánh vào Nghệ An, nghĩa quân phát hiện quân Minh đang giam giữ hàng vạn con tin là dân thường làm mộc đỡ đạn. Sự nhân nghĩa của Lê Lợi bị đặt lên bàn cân với chiến thắng của đại cuộc.",
    choices: [
      { label: "💥 [MƯU KẾ BỒ ẢI] Dùng thủy quân đánh vu hồi, chấp nhận thương vong cho con tin để giành chiến thắng", nextId: "act2_boai_campaign" },
      { label: "📜 [TÂM CÔNG ĐẠI CÁO] Đình chỉ tấn công, dùng Nguyễn Trãi viết thư khuyên hàng để cứu dân", nextId: "act2_nghean_surrender" }
    ]
  },

  act2_boai_campaign: {
    chapter: "NHÁNH 2A: HÀN CỐT BỒ ẢI",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    text: "Trận Bồ Ải thắng lớn. Quân Minh chết như rạ. Nhưng bờ sông Trách Hãn nhuộm đỏ máu của cả giặc lẫn dân thường. Lê Lợi đứng trên đồi cao, nhìn cảnh tượng hoang tàn, tự hỏi liệu ngai vàng được xây trên xương máu bách tính có thực sự mang lại thái bình?",
    choices: [
      { label: "⚔️ [BẮC TIẾN CẤP TỐC] Che giấu sự dằn vặt, xua quân Bắc tiến chiếm Đông Quan", nextId: "ending_leloi_northern_conquest" },
      { label: "🕊️ [BÌNH NGÔ ĐẠI CÁO] Lập đàn cầu siêu cho vong linh, ban bố đại cáo sám hối và tuyên ngôn độc lập", nextId: "ending_leloi_great_announcement" }
    ]
  },

  act2_nghean_surrender: {
    chapter: "NHÁNH 2B: DỤ HÀNG NGHỆ AN",
    speaker: "Nguyễn Trãi",
    avatar: "📜",
    emotion: "heroic",
    text: "Thư dụ hàng được gửi đi. Tướng Minh trong thành Nghệ An lung lay, nhưng một toán phản quân cực đoan trong hàng ngũ Lam Sơn không muốn tha thứ cho giặc, âm mưu phá hoại hòa đàm bằng cách ám sát sứ giả. Lê Lợi phải giải quyết nội loạn trước khi vãn hồi hòa bình.",
    choices: [
      { label: "🏆 [THANH TRỪNG NỘI BỘ] Vô tình trấn áp phe cực đoan, bảo vệ hòa đàm", nextId: "ending_leloi_sovereignty_peace" },
      { label: "👑 [DÙNG NHÂN THU PHỤC] Tha thứ cho phe cực đoan, dùng nhân đức để cảm hóa họ", nextId: "ending_leloi_golden_era" }
    ]
  },

  // Endings for Lê Lợi
  ending_leloi_chilang_triumph: {
    chapter: "KẾT CỤC 1A: MÁU ĐỔ CHI LĂNG",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    ending: {
      title: "🏆 ĐẠI THẮNG CHI LĂNG",
      type: "victory",
      desc: "Liễu Thăng mất đầu. Quân Minh thảm bại. Lê Lợi lên ngôi Hoàng Đế. Nhưng hằng đêm, ông vẫn mơ thấy ánh mắt của Lê Lai và kẻ phản bội trong đêm Chí Linh."
    },
    text: "Ta đã giành được giang sơn, nhưng đã đánh mất đi sự hồn nhiên của một người anh hùng Lũng Nhai thuở nào."
  },

  ending_leloi_peace: {
    chapter: "KẾT CỤC 1B: HÒA BÌNH CHUA XÓT",
    speaker: "Nguyễn Trãi",
    avatar: "📜",
    emotion: "heroic",
    ending: {
      title: "🕊️ HỘI THỀ ĐÔNG QUAN",
      type: "historical",
      desc: "Vương Thông rút quân. Đại Việt thái bình. Tuy nhiên, quyết định tha cho quân Minh khiến nhiều tướng lĩnh bất mãn, mầm mống của những cuộc thanh trừng công thần sau này đã được gieo."
    },
    text: "Đại nghĩa thắng hung tàn. Nhưng lòng người khó đoán, thái bình hôm nay liệu có bền lâu?"
  },

  ending_leloi_emperor: {
    chapter: "KẾT CỤC 1C: HOÀNG ĐẾ SẮT ĐÁ",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    ending: {
      title: "👑 HOÀNG ĐẾ LÊ THÁI TỔ",
      type: "victory",
      desc: "Lê Lợi dẹp yên giặc ngoài, cai trị đất nước bằng bàn tay sắt. Triều đại Hậu Lê bắt đầu bằng máu và sự uy quyền tuyệt đối."
    },
    text: "Kẻ thù không chỉ ở ngoài cõi, mà còn ở ngay trong triều đường. Ta không thể mềm lòng."
  },

  ending_leloi_legend: {
    chapter: "KẾT CỤC 1D: GƯƠM THẦN ẨN MÌNH",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    ending: {
      title: "🗡️ GƯƠM THẦN THUẬN THIÊN",
      type: "historical",
      desc: "Lê Lợi không màng ngôi vị, trả gươm cho rùa vàng rồi lui về quy ẩn tại quê nhà Lam Sơn, để lại một huyền thoại bất tử về vị anh hùng vô danh."
    },
    text: "Quyền lực là phù du. Giang sơn thái bình, đó là lúc người cầm gươm nên trở về với ruộng đồng."
  },

  ending_leloi_northern_conquest: {
    chapter: "KẾT CỤC 2A: BÁ NGHIỆP TRÊN XƯƠNG MÁU",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    ending: {
      title: "💥 BẮC TIẾN THÀNH CÔNG",
      type: "victory",
      desc: "Đông Quan thất thủ. Lê Lợi nắm trọn quyền hành. Nhưng bóng ma của trận Bồ Ải luôn ám ảnh, khiến ông trở thành một vị vua đa nghi và cô độc."
    },
    text: "Ta ngồi trên ngai vàng cao ngất, nhưng xung quanh chỉ toàn là những bóng ma khóc than."
  },

  ending_leloi_great_announcement: {
    chapter: "KẾT CỤC 2B: BÌNH NGÔ ĐẠI CÁO",
    speaker: "Nguyễn Trãi",
    avatar: "📜",
    emotion: "heroic",
    ending: {
      title: "📜 LỜI CÁO THIÊN THU",
      type: "historical",
      desc: "Bình Ngô Đại Cáo ra đời không chỉ là bản tuyên ngôn độc lập, mà còn là lời tự vấn lương tâm của Lê Lợi về cái giá của chiến tranh."
    },
    text: "Việc nhân nghĩa cốt ở yên dân... Nhưng hỡi ôi, ta đã phải đánh đổi quá nhiều để có chữ 'yên' này."
  },

  ending_leloi_sovereignty_peace: {
    chapter: "KẾT CỤC 2C: QUYỀN LỰC TUYỆT ĐỐI",
    speaker: "Lê Lợi",
    avatar: "🤴",
    emotion: "heroic",
    ending: {
      title: "🏆 DỤ HÀNG THÀNH CÔNG",
      type: "victory",
      desc: "Thành Nghệ An mở cửa. Kẻ chống đối bị tiêu diệt. Lê Lợi thiết lập nền hòa bình dựa trên sự quy phục tuyệt đối, mở ra một thời kỳ trị vì hà khắc."
    },
    text: "Hòa bình không thể được xây dựng bằng sự yếu đuối. Chỉ có sức mạnh tuyệt đối mới dập tắt mọi mầm loạn."
  },

  ending_leloi_golden_era: {
    chapter: "KẾT CỤC 2D: KỶ NGUYÊN VÀNG SON",
    speaker: "Dòng Lịch Sử",
    avatar: "📜",
    emotion: "solemn",
    ending: {
      title: "👑 KỶ NGUYÊN HẬU LÊ",
      type: "historical",
      desc: "Lê Lợi dùng nhân đức cảm hóa muôn người. Đại Việt bước vào kỷ nguyên phát triển rực rỡ nhất, nơi sự khoan dung trị vì thay cho gươm đao."
    },
    text: "Lấy nhân nghĩa thắng hung tàn. Đó mới là sức mạnh vĩ đại nhất của người Đại Việt."
  }
};
