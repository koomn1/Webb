#!/usr/bin/env node

/**
 * SÈN Parfums - Supabase Terminal Control Center (CLI)
 * Manage your database, orders, visitors, and credentials directly from CMD / Terminal.
 * 
 * Usage:
 *   node scripts/manage-db.mjs config <supabase_url> <supabase_anon_key>
 *   node scripts/manage-db.mjs status
 *   node scripts/manage-db.mjs orders
 *   node scripts/manage-db.mjs update <order_number> <CONFIRMED|SHIPPED|DELIVERED|CANCELLED>
 *   node scripts/manage-db.mjs visitors
 *   node scripts/manage-db.mjs test-order
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env.local');

// 1. Helper to read .env.local
function loadEnv() {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length) {
      env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseUrl.includes('mock-sen-project')
);

const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Command Dispatcher
const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n⚜️  === SÈN Parfums - Supabase Terminal Control Center === ⚜️\n');

switch (command) {
  case 'config': {
    const url = args[1];
    const key = args[2];
    if (!url || !key) {
      console.error('❌ خطأ: يرجى كتابة الرابط ومفتاح الـ Anon Key.');
      console.log('📌 مثال الاستخدام:');
      console.log('   node scripts/manage-db.mjs config https://xyzcompany.supabase.co eyJhbGciOi...');
      process.exit(1);
    }
    const envContent = `# SÈN Parfums Environment Configuration\nNEXT_PUBLIC_SUPABASE_URL=${url}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${key}\n`;
    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('✅ تم حفظ بيانات سوبابيز بنجاح في ملف .env.local!');
    console.log(`🔗 الرابط: ${url}`);
    console.log(`🔑 المفتاح: ${key.substring(0, 15)}...`);
    console.log('\n🚀 جرب الآن فحص الاتصال بالأمر:\n   npm run db status\n');
    break;
  }

  case 'status': {
    if (!isConfigured) {
      console.log('⚠️  سوبابيز غير مربوط بعد بملف .env.local.');
      console.log('💡 لربط مشروعك من الـ CMD مباشرة، شغّل الأمر:');
      console.log('   node scripts/manage-db.mjs config <SUPABASE_URL> <SUPABASE_ANON_KEY>\n');
      console.log('أو استخدم أداة Supabase الرسمية:');
      console.log('   npx supabase login');
      console.log('   npx supabase link --project-ref <your-project-id>\n');
      process.exit(0);
    }

    console.log(`🔗 URL: ${supabaseUrl}`);
    console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 15)}...`);
    console.log('⏳ جاري اختبار الاتصال بقاعدة البيانات...\n');

    try {
      const start = Date.now();
      const { data: orders, error: ordersErr } = await supabase.from('orders').select('id', { count: 'exact', head: true });
      const latency = Date.now() - start;

      if (ordersErr) {
        console.error('❌ فشل الاتصال بالجدول:', ordersErr.message);
        console.log('💡 هل قمت بتشغيل كود `supabase_schema.sql` في الـ SQL Editor لإنشاء الجداول؟');
      } else {
        console.log(`✅ الاتصال ناجح ومستقر! (زمن الاستجابة: ${latency}ms)`);
        
        // Fetch counts
        const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: visitorsCount } = await supabase.from('active_visitors').select('*', { count: 'exact', head: true });

        console.log('\n📊 إحصائيات سوبابيز الحية:');
        console.log(`   📦 إجمالي الطلبات (orders): ${ordersCount ?? 0}`);
        console.log(`   👥 المستخدمين المسجلين (profiles): ${profilesCount ?? 0}`);
        console.log(`   🌐 الزوار النشطين (active_visitors): ${visitorsCount ?? 0}\n`);
      }
    } catch (err) {
      console.error('❌ استثناء أثناء الاتصال:', err.message);
    }
    break;
  }

  case 'orders': {
    if (!isConfigured) {
      console.log('⚠️ يرجى ضبط .env.local أولاً عبر: node scripts/manage-db.mjs config <URL> <KEY>');
      process.exit(1);
    }

    console.log('📦 جاري جلب الطلبات من سوبابيز...\n');
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ خطأ أثناء جلب الطلبات:', error.message);
      } else if (!data || data.length === 0) {
        console.log('📭 لا توجد طلبات مسجلة في جدول orders حالياً.');
      } else {
        console.log(`📋 تم العثور على (${data.length}) طلب:\n`);
        console.table(
          data.map((o) => ({
            'رقم الطلب': o.order_number,
            'اسم العميل': o.customer_name,
            'الموبايل': o.phone,
            'المحافظة': o.governorate,
            'الإجمالي': `${o.total_amount} ج.م`,
            'الحالة': o.status,
            'الدفع': o.payment_method,
            'التاريخ': new Date(o.created_at).toLocaleString('ar-EG'),
          }))
        );
      }
    } catch (err) {
      console.error('❌ خطأ:', err.message);
    }
    break;
  }

  case 'update': {
    const orderNumber = args[1];
    const newStatus = args[2]?.toUpperCase();
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!orderNumber || !newStatus || !validStatuses.includes(newStatus)) {
      console.error('❌ خطأ: يرجى تحديد رقم الطلب والحالة الجديدة.');
      console.log('📌 الحالات المتاحة:', validStatuses.join(' | '));
      console.log('📌 مثال الاستخدام:');
      console.log('   node scripts/manage-db.mjs update SEN-1082 CONFIRMED');
      process.exit(1);
    }

    if (!isConfigured) {
      console.log('⚠️ يرجى ضبط .env.local أولاً');
      process.exit(1);
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('order_number', orderNumber)
        .select();

      if (error) {
        console.error('❌ فشل تحديث الطلب:', error.message);
      } else if (!data || data.length === 0) {
        console.log(`⚠️ لم يتم العثور على طلب برقم: ${orderNumber}`);
      } else {
        console.log(`✅ تم تحديث الطلب [${orderNumber}] بنجاح إلى الحالة: ${newStatus}`);
      }
    } catch (err) {
      console.error('❌ خطأ:', err.message);
    }
    break;
  }

  case 'visitors': {
    if (!isConfigured) {
      console.log('⚠️ يرجى ضبط .env.local أولاً');
      process.exit(1);
    }
    try {
      const { data, error } = await supabase
        .from('active_visitors')
        .select('*')
        .order('last_heartbeat', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ خطأ:', error.message);
      } else if (!data || data.length === 0) {
        console.log('🌐 لا يوجد زوار نشطين مسجلين في الجدول حالياً.');
      } else {
        console.table(data);
      }
    } catch (err) {
      console.error('❌ خطأ:', err.message);
    }
    break;
  }

  case 'test-order': {
    if (!isConfigured) {
      console.log('⚠️ يرجى ضبط .env.local أولاً');
      process.exit(1);
    }
    const orderNum = `SEN-${Math.floor(1000 + Math.random() * 9000)}`;
    console.log(`🧪 جاري إرسال طلب تجريبي برقم [${orderNum}]...`);
    try {
      const { data, error } = await supabase.from('orders').insert([
        {
          order_number: orderNum,
          customer_name: 'عميل تجريبي (CMD)',
          phone: '01018995002',
          governorate: 'القاهرة',
          address: 'المعادي - شارع 9',
          notes: 'طلب تجريبي تم إنشاؤه عبر سطر الأوامر CMD',
          items: [{ name: 'سِيان زيست (رجالي)', quantity: 1, price: 650 }],
          subtotal: 650,
          shipping_fee: 45,
          total_amount: 695,
          payment_method: 'COD',
          status: 'PENDING',
        },
      ]).select();

      if (error) {
        console.error('❌ فشل إنشاء الطلب التجريبي:', error.message);
      } else {
        console.log(`🎉 تم إنشاء الطلب التجريبي [${orderNum}] بنجاح في سوبابيز!`);
        console.log('يمكنك رؤيته الآن في لوحة تحكم الأدمن أو عبر الأمر:');
        console.log('   npm run db orders\n');
      }
    } catch (err) {
      console.error('❌ خطأ:', err.message);
    }
    break;
  }

  default:
    console.log('📖 الأوامر المتاحة للتحكم في سوبابيز من الـ CMD:\n');
    console.log('  1. ربط المشروع وتخزين المفاتيح:');
    console.log('     node scripts/manage-db.mjs config <URL> <KEY>\n');
    console.log('  2. اختبار حالة الاتصال والإحصائيات:');
    console.log('     node scripts/manage-db.mjs status\n');
    console.log('  3. استعراض كافة الطلبات في جدول أنيق:');
    console.log('     node scripts/manage-db.mjs orders\n');
    console.log('  4. تحديث حالة أي طلب:');
    console.log('     node scripts/manage-db.mjs update <ORDER_NUMBER> <STATUS>');
    console.log('     (STATUS: PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED)\n');
    console.log('  5. إنشاء طلب تجريبي للاختبار:');
    console.log('     node scripts/manage-db.mjs test-order\n');
    console.log('  6. استعراض الزوار المتواجدين حالياً:');
    console.log('     node scripts/manage-db.mjs visitors\n');
    console.log('----------------------------------------------------');
    console.log('💡 يمكنك أيضاً استخدام الأداة الرسمية لسوبابيز:');
    console.log('   npx supabase login           (تسجيل الدخول بالتوكن)');
    console.log('   npx supabase projects list   (عرض قائمة مشاريعك)');
    console.log('   npx supabase link            (ربط المشروع بالريبو)');
    console.log('   npx supabase db execute      (تنفيذ كود SQL من الـ CMD)\n');
    break;
}
